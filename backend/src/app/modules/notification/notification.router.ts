import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

const allRoles = auth(
  ENUM_USER_ROLE.ADMIN,
  ENUM_USER_ROLE.SUPER_ADMIN,
  ENUM_USER_ROLE.WRITER,
  ENUM_USER_ROLE.USER
);

router.get("/", allRoles, NotificationController.getUserNotifications);

// Static route MUST come before the dynamic /:id/read route so Express does
// not swallow "mark-all-read" as an :id value.
router.patch("/mark-all-read", allRoles, NotificationController.markAllNotificationsAsRead);

router.patch("/:id/read", allRoles, NotificationController.markNotificationAsRead);

export const NotificationRouter = router;
