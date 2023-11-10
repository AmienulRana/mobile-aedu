import moment from "moment/moment";

export const averageRating = (zms_CRatings) => {
  const ratings = zms_CRatings?.map((item) => item?.rating);
  const sum = ratings?.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings?.length;
};

export function getTimeAgoString(createdAt) {
  const createdMoment = moment(createdAt);
  const now = moment();
  const diffMinutes = now.diff(createdMoment, "minutes");
  const diffHours = now.diff(createdMoment, "hours");
  const diffDays = now.diff(createdMoment, "days");

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
}
