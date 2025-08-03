type CachedTrips = {
  data: any;
  lastFetched: number;
};

export const popularTripsCache: CachedTrips = {
  data: null,
  lastFetched: 0,
};
