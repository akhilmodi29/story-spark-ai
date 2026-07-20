import express from "express";
import { AiModelService } from "../app/modules/ai_model/ai_model.service";
import { ReviewController } from "../app/modules/review/review.controller";
import { AIModelValidator } from "../app/modules/ai_model/ai_model.validation";
import { ReviewValidator } from "../app/modules/review/review.validation";
import validateRequest from "../app/middleware/validate.request";
import auth from "../app/middleware/auth.middleware";
import checkRequestLimit from "../app/middleware/check.request.limit";
import storyGenerationRateLimiter from "../app/middleware/story.rate-limiter";
import { ENUM_USER_ROLE } from "../enums/user";
import catchAsync from "../shared/catch_async";
import sendResponse from "../shared/send_response";
import httpStatus from "http-status";
import { Request, Response } from "express";
import piiScrubberMiddleware from "../app/middleware/pii_scrubber";
import { generateStory } from "../services/ai.service";
import { runWithQuotaCleanup } from "../app/modules/ai_model/quota.lifecycle";
// NEW — dedupes duplicate/retried generation requests before they cost quota
// or trigger a second AI call. See issue #5090.
import idempotencyMiddleware, {
  completeIdempotentRequest,
  releaseIdempotentRequest,
} from "../app/middleware/idempotency.middleware";

const router = express.Router();

/** STORY CONTINUATION - single */
router.post(
  "/continue",
  // Authenticated users get the per-user storyGenerationRateLimiter.
  // Unauthenticated requests are rejected by auth middleware first.
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  storyGenerationRateLimiter,
  checkRequestLimit(),
  piiScrubberMiddleware,
  validateRequest(AIModelValidator.aiStoryContinuation),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, language } = req.body as { prompt: string; language?: string };
    const guard = res.locals.quotaRefundGuard;

    if (!guard) {
      throw new Error(
        "Quota guard missing — checkRequestLimit middleware is required"
      );
    }

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    await runWithQuotaCleanup(guard, async () => {
      const result = await AiModelService.aiModelStoryContinuation(
        { prompt, language },
        undefined,
        controller.signal
      );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: result,
      });
    });
  })
);

/** STORY CONTINUATIONS - multiple */
router.post(
  "/continuations",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  storyGenerationRateLimiter,
  checkRequestLimit(),
  piiScrubberMiddleware,
  validateRequest(AIModelValidator.aiStoryContinuation),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, language, count } = req.body as { prompt: string; language?: string; count?: number };
    const guard = res.locals.quotaRefundGuard;

    if (!guard) {
      throw new Error(
        "Quota guard missing — checkRequestLimit middleware is required"
      );
    }

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    await runWithQuotaCleanup(guard, async () => {
      const result = await AiModelService.aiFreeStoryContinuationMultiple(
        { prompt, language, count },
        controller.signal
      );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: result,
      });
    });
  })
);

/** CREATE REVIEW */
router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(ReviewValidator.createReview),
  ReviewController.createReview
);

/** GENERATE STORY */
router.post(
  "/generate",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  // NEW — must run before checkRequestLimit() so a duplicate/retried request
  // never reserves quota or reaches generateStory() a second time.
  idempotencyMiddleware(),
  storyGenerationRateLimiter,
  checkRequestLimit(),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, provider, options } = req.body;
    const guard = res.locals.quotaRefundGuard;
    const idempotencyKey = res.locals.idempotencyKey as string | undefined;

    if (!guard) {
      throw new Error(
        "Quota guard missing — checkRequestLimit middleware is required"
      );
    }

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    try {
      await runWithQuotaCleanup(guard, async () => {
        const result = await generateStory(prompt, provider, options);
        const responseBody = {
          success: true,
          message: "Story generated successfully in structured format!",
          data: result,
        };

        // Cache the response against this Idempotency-Key so a retried
        // request replays it instead of calling the AI provider again.
        await completeIdempotentRequest(idempotencyKey, httpStatus.OK, responseBody);

        sendResponse(res, {
          statusCode: httpStatus.OK,
          ...responseBody,
        });
      });
    } catch (err) {
      // Release the key on failure so a legitimate retry isn't stuck
      // behind a stale "in_progress" record.
      await releaseIdempotentRequest(idempotencyKey);
      throw err;
    }
  })
);

export default router;