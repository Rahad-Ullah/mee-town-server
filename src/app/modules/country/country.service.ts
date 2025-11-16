import QueryBuilder from '../../builder/QueryBuilder';
import { Country } from './country.model';

// ---------------- get all countries ----------------
const getAllCountriesFromDB = async (query: Record<string, any>) => {
  const countryQuery = new QueryBuilder(Country.find({}), query)
    .search(['name', 'iso2', 'iso3'])
    .fields();

  const result = await countryQuery.modelQuery.lean();

  return result;
};

export const CountryServices = {
  getAllCountriesFromDB,
};
