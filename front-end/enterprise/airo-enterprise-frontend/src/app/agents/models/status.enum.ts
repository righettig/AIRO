export enum Status {
  Unavailable = 0,
  Active = 1,
  Offline = 2,
}

export function getStatusString(status: Status): string {
  switch (status) {
    case Status.Unavailable:
      return 'Unavailable';
    case Status.Active:
      return 'Active';
    case Status.Offline:
      return 'Offline';
    default:
      return 'Unknown';
  }
}
