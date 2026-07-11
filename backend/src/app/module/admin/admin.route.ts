import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";

const router = Router()

router.get('/' ,adminController.getAllAdmins)


router.get('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN),adminController.getAdminByID);



// only super admin can update the Admin_Role and Delete the admin

router.patch('/:id', checkAuth(Role.SUPER_ADMIN), validateRequest(updateAdminZodSchema),adminController.updateAdmin);

router.delete('/:id', checkAuth(Role.SUPER_ADMIN),adminController.deleteAdmin)


export const AdminRoutes = router;


