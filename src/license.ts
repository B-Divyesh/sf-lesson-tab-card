const slug = 'lesson-tab-card';
const licenseKey = `sb_license:${slug}`;
const verdictKey = `sb_license_verdict:${slug}`;
const apiBase = 'https://api.sociobot.in/api/v1';

type Verdict = { valid: boolean; checkedAt: number };

export function captureReturnedLicense(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  localStorage.setItem(licenseKey, token);
  localStorage.removeItem(verdictKey);
  url.searchParams.delete('license');
  history.replaceState({}, '', url.pathname + url.search + url.hash);
  return true;
}

export function cachedLicenseIsValid(): boolean {
  if (!localStorage.getItem(licenseKey)) return false;
  return readVerdict()?.valid === true;
}

export function hasStoredLicense(): boolean {
  return Boolean(localStorage.getItem(licenseKey));
}

export async function verifyStoredLicense(): Promise<boolean> {
  const token = localStorage.getItem(licenseKey);
  if (!token) return false;
  const cached = readVerdict();
  if (cached && Date.now() - cached.checkedAt < 86_400_000) return cached.valid;
  return verifyToken(token);
}

export async function restoreLicense(token: string): Promise<boolean> {
  const clean = token.trim();
  if (!clean) return false;
  localStorage.setItem(licenseKey, clean);
  localStorage.removeItem(verdictKey);
  return verifyToken(clean);
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiBase}/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verify failed');
    const result = await response.json() as { valid?: boolean };
    const verdict = { valid: result.valid === true, checkedAt: Date.now() };
    localStorage.setItem(verdictKey, JSON.stringify(verdict));
    return verdict.valid;
  } catch {
    // A failed background check is not a revocation. Preserve the last
    // definitive valid verdict so a one-time purchase keeps working offline.
    return cachedLicenseIsValid();
  }
}

function readVerdict(): Verdict | null {
  try { return JSON.parse(localStorage.getItem(verdictKey) ?? '') as Verdict; }
  catch { return null; }
}

export const checkoutUrl = `${apiBase}/products/${slug}/checkout`;
