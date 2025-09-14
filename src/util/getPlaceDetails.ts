import axios from 'axios';
import config from '../config';

export async function getPlaceDetails(placeId: string) {
  const res = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json',
    {
      params: {
        place_id: placeId,
        fields: 'address_component,photo',
        key: config.google.api_key,
      },
    }
  );

  const components = res.data.result.address_components;
  const photos = res.data.result.photos;

  // 1. Try to find a city (locality)
  let city = components.find((c: any) =>
    c.types.includes('locality')
  )?.long_name;

  // 2. If not found, fallback to district/county
  if (!city) {
    city = components.find((c: any) =>
      c.types.includes('administrative_area_level_2')
    )?.long_name;
  }

  // 3. Last fallback: state/province
  if (!city) {
    city = components.find((c: any) =>
      c.types.includes('administrative_area_level_1')
    )?.long_name;
  }

  // Country code
  const countryCode =
    components.find((c: any) => c.types.includes('country'))?.short_name ||
    null;

  // Build photo URL
  let photoUrl = null;
  if (photos?.length) {
    const ref = photos[0].photo_reference;
    photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${config.google.api_key}`;
  }

  // throw error if no place found
  if (!city || !countryCode || !photoUrl) {
    throw new Error('Place not found');
  }

  return {
    city: city || 'Unknown City',
    countryCode: countryCode || 'Unknown Country',
    photoUrl: photoUrl || null,
  };
}
