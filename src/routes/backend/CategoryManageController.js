import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, Required } from '../../lib/decorator'
import { UserService } from '../../service'

const userService = new UserService()

@controller('/manage/category')
export class CategoryManageController {



}