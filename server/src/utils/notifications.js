import Notification from '../models/Notification.js';

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  data = {},
}) => {
  return Notification.create({
    userId,
    type,
    title,
    message,
    data,
    channels: { inApp: true, email: false, whatsapp: false },
  });
};

export const notifyInterestRequest = async ({ userId, interestRequest, schoolName, positionOffered }) => {
  if (!userId) return null;

  return createNotification({
    userId,
    type: 'interest_request',
    title: 'New interest from a school',
    message: `${schoolName} is interested in you for the ${positionOffered} position.`,
    data: {
      interestRequestId: interestRequest._id,
      schoolId: interestRequest.schoolId,
      candidateId: interestRequest.candidateId,
    },
  });
};
