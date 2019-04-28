import moment from 'moment-timezone';

export function formatDate(iso8601) {
  const datetime = iso8601ToMoment(iso8601);
  return datetime.format('L');
}

export function formatDatetime(iso8601) {
  const datetime = iso8601ToMoment(iso8601);
  return datetime.format('LLL');
}

export function iso8601ToMoment(iso8601) {
  return  moment(iso8601).tz(moment.tz.guess());
}

export function dateToISO8601(date) {
  let keepOffset = true;
  const dateString = moment(date).toISOString(keepOffset);
  return dateString;
}

export function ISO8601ToDate(iso8601) {
  return iso8601ToMoment(iso8601).toDate();
}
