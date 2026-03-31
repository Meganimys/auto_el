'use server'

import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from './lib/prisma'

export async function changeUserData(formData:FormData) {
    const userName = formData.get('userName') as string;
    const userPhone = formData.get('userPhone') as string;
    const userEmail = formData.get('userEmail') as string;
    const userAvatar = formData.get("userImage") as File;
    const userId = formData.get("userId") as string;
    console.log('File: ', userAvatar);

    try {

    const client = await clerkClient();

    if(userName.length > 2 && userId) {
        const changeName = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                fullName: userName,
            }
        });
    }
    if(userPhone.length > 12 && userId) {
        const changePhone = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                phone: userPhone,
            }
        });
    }
    if(userEmail.length > 5 && userId) {
        await client.users.updateUser(userId, {
            primaryEmailAddressID: userEmail,
        });

        const changeEmail = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email: userEmail,
            }
        })
    }
    if(userAvatar && userAvatar.size > 0 && userId) {
        const response = await client.users.updateUserProfileImage(userId, {
            file: userAvatar,
        });
        await prisma.user.update({
  where: { id: userId },
  data: { avatarUrl: response.imageUrl }
});
    }
} catch(err) {
    console.error("При зміні даних виникла помилка: ", err);
};
}