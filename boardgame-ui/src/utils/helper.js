import moment from 'moment-timezone';

export function formatDate(iso8601) {
  const datetime = moment(iso8601).tz(moment.tz.guess());
  return datetime.format('LL');
}

export function formatDatetime(iso8601) {
  const datetime = moment(iso8601).tz(moment.tz.guess());
  return datetime.format('LLL');
}

export function dateToISO8601(date) {
  let keepOffset = true;
  const dateString = moment(date).toISOString(keepOffset);
  return dateString;
}
