import { loadCatalog } from '../../../src/lib/content/load';
export const catalog = await loadCatalog();
export const companyNames = catalog.companies.filter(c => c.status === 'published').map(c => c.name).sort((a,b) => a.localeCompare(b, 'ro'));
export const companyCount = companyNames.length;
export const serviceNames = catalog.services.filter(s => s.status === 'published').map(s => s.name).sort((a,b) => a.localeCompare(b, 'ro'));
