import moment from 'moment-timezone';

export function formatDate(iso8601) {
  const datetime = moment(iso8601).tz(moment.tz.guess());
  return datetime.format('L');
}

export function formatDatetime(iso8601) {
  const datetime = moment(iso8601).tz(moment.tz.guess());
  return datetime.format('LLL');
}
