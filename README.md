# Contact Studio

A Hi-C contact-map browser that runs entirely in your web browser. Open `.hic` files from your computer, GEO,
ENCODE, 4DN or Google Cloud Storage, compare samples side by side, add tracks and 2D annotations, export
publication figures, and share sessions as links. Nothing to install: your files are read in place and never
uploaded.

**Open it: https://minjikimlab.github.io/ContactStudio/** (Chrome or Edge).

Version 0.4.0 (2026-11-10). Tested in Google Chrome on macOS; Edge should work (same engine). Firefox and
Safari cannot reopen local files by themselves and are untested.

## Quick start

1. Open https://minjikimlab.github.io/ContactStudio/ in Chrome.
2. Drop `.hic` files (any size) and track files anywhere on the page, or use **+ Sample ▾**. Try
   **+ Sample ▾ → From GEO accession…** with `GSE63525` or `GSM7823645` to stream public data.
3. Once, so sessions reopen your files without a click: **Session ▾ → Folders on this computer… → Remember a data
   folder…**, choose the folder that holds your maps, and pick **"Allow on every visit"** when Chrome asks.
4. **Session ▾ → Save** keeps your work; **Share link…** makes a link that shows the same views to anyone.

## What it does

- **Maps.** Any bin size and normalisation stored in the file (KR, VC, SCALE…), observed/expected, whole-genome
  and inter-chromosomal views, several windows at different loci.
- **Comparisons.** Two samples in one panel: split diagonal (A above, B below), A − B, or log2(A/B), one scale.
- **Tracks.** bigWig, bigBed, bedGraph, WIG, BED, narrowPeak, broadPeak (gzipped too) on the top and left axes,
  one autoscale per track per window, shown on all samples or on chosen ones (same-assay tracks of different
  samples can share one lane).
- **2D annotations.** BEDPE loops and domains, and breakpoint lists between chromosomes, drawn on every view
  including whole-genome.
- **Genomes.** RefSeq genes and Roadmap chromHMM (GM12878, K562) for hg19, hg38 and mm10 are built in; 35 more
  assemblies (mm39, mm9, rn6, dm6, ce11, sacCer3, TAIR10, T2T hs1 and others) are recognised from the chromosome
  lengths in the `.hic` file and their genes fetched once from UCSC. Gene search in the locus box.
- **Figures.** PNG (300 dpi) and SVG, with tracks, colour bars, scale bar and a caption stating region, bin size,
  normalisation and data sources.
- **Sessions and links.** Sessions saved in the browser or as `.json` files in a folder you choose; share links
  (up to 8 KB) hold the whole session; sessions find your local files again by themselves.

## Loading data

| Source | How | Notes |
|---|---|---|
| Your computer | drop files, or **+ Sample ▾ / + Track** | only the parts in view are read; nothing is uploaded |
| GEO | **+ Sample ▾ → From GEO accession…** | sample, series, or pasted GEO page/file address; `.hic`, bigWig and bigBed stream in pieces; text tracks are downloaded |
| ENCODE and 4DN | **+ Sample ▾ → From ENCODE / 4DN…** and **Add tracks from ENCODE / 4DN…** | one picker over prebuilt indexes (hg38, hg19, mm10; built 2026-10-20); files are read from the consortia's public S3 buckets |
| Web URL, Dropbox | **+ Sample ▾ → From URL…** | any `https://` file whose server allows cross-site reads and Range requests; Dropbox share links work as copied |
| Google Cloud Storage | paste `gs://bucket/file.hic` into **From URL…**, or **From Google Cloud Storage…** | public files need nothing; private buckets ask once for **Sign in with Google** or a pasted access token (`gcloud auth print-access-token` in Cloud Shell) |

Google Drive links do not work (Drive refuses cross-site reads); download the file instead. 4DN portal download
links need a login; use the picker.

## Sessions and local files

- **Save** updates the current session; **Save as…** makes a new one. **Export .json** writes a file to send.
- **Sessions folder** (Chrome/Edge): **Session ▾ → Folders on this computer… → Choose a sessions folder**. Each
  session is then a plain `<name>.contact-studio.json` file, visible in Finder and backed up with your files.
- **Reopening local files.** A session records each file's name, size and date and, for files inside a
  remembered data folder, its place in that folder (never a full path). Whatever Chrome already allows opens with
  no click; the rest costs one click per folder, not per file. Session files hold no paths or permissions, so they open on any computer; a
  recipient is asked to point at their own copies.
- **Share links** contain the whole session (views, windows, samples, tracks, settings). Remote files are fetched
  from their source; local files are matched by name and size on the recipient's side. Links over 8 KB are
  shared as session files instead (25 MB maximum).

## Privacy

The app has no server and never sends your maps, tracks or sessions anywhere. It contacts:

- **at every start:** Google Fonts; **at the first map:** the `.hic` reader from `cdn.jsdelivr.net`;
- **only on your action:** GEO (`ncbi.nlm.nih.gov`), the ENCODE and 4DN S3 buckets, UCSC (gene files for other
  genomes), Google Cloud Storage and Google sign-in, Dropbox, and any server whose link you paste.

Each sees your IP address and which file is read. A session or link naming servers other than GEO, ENCODE, 4DN
or UCSC lists them and asks before anything is requested; Google Cloud buckets are asked about once each.
Redirects are never followed without asking. Imported sessions and links are checked against a fixed schema.

## Hosting your own copy

This repository is the built app that the page above serves. Any static web server (GitHub Pages, a department
server, an S3 bucket) can host a copy of it; no server code is needed. The page needs internet access for the
`.hic` reader (`cdn.jsdelivr.net`) and for remote data. **Sign in with Google** on a copy needs its own OAuth
client ID (public, not a secret; it grants nothing by itself, bucket IAM permissions decide who may read):

1. https://console.cloud.google.com → a project → **Google Auth Platform → Get started**: app name "Contact
   Studio", audience *Internal* if offered, else *External* in *Testing* with lab members as **Test users**.
2. **Data Access → Add scopes**: `https://www.googleapis.com/auth/devstorage.read_only`.
3. **Clients → Create client → Web application → Authorized JavaScript origins**: the site's origin, e.g.
   `https://<user>.github.io` (no path).
4. Put the client ID in `contact-studio.config.js` next to the app (the build never overwrites it):

   ```js
   window.CONTACT_STUDIO_CONFIG = { googleClientId: '1234567890-abcdef.apps.googleusercontent.com' };
   ```

Users can also type a client ID into the page (bucket browser → **Sign-in settings…**). Source, tests and the
running Methods are kept separately. When you publish figures made with ENCODE or 4DN data, credit the
consortium and the producing lab as their data-use policies ask (the caption names the accessions).
