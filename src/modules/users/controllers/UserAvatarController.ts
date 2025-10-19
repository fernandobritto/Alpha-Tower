import { Request, Response } from 'express'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = new UpdateUserAvatarService()

    if (!request.file) {
      return response.status(400).json({
        error: 'Avatar file is required',
      })
    }

    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    })

    return response.status(200).json(user)
  }
}
