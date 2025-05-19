export const unReadNotifications = (notifications) => {
    return notifications?.filter((n) => n.isRead === false);
}