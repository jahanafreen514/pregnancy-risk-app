export const sendDoctorNotification = (
  doctorEmail,
  notification
) => {

  if(!doctorEmail) return;


  const key =
    `doctorNotifications_${doctorEmail}`;


  const oldNotifications =
    JSON.parse(
      localStorage.getItem(key)
    ) || [];


  oldNotifications.unshift({
    ...notification,
    date:new Date().toLocaleString()
  });


  localStorage.setItem(
    key,
    JSON.stringify(oldNotifications)
  );

};