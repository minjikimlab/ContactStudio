# Contact Studio (standalone)

A Hi-C contact map browser that runs entirely in your web browser: open `.hic` files from disk or stream
them from GEO, compare samples side by side, add gene, chromHMM, bigWig, bigBed, bedGraph, BED and BEDPE
tracks, export figures, and share sessions as links.

This folder is the same app as the Contact Studio page in Claude, built from the same source. The
differences: this copy can contact other sites (so it streams GEO files, ENCODE and 4DN files, web URLs and
Dropbox links, and downloads genes for other genomes), it saves sessions
in your browser and as files (no Claude account storage), and exports go to your Downloads folder.

## Hosted copy

The current build is served at **https://minjikimlab.github.io/ContactStudio/** (GitHub Pages, from the public
repository https://github.com/minjikimlab/ContactStudio). Open that address in Chrome and everything in this
README works without installing anything; share links made there point at it. The repository holds only this
built folder; the source and tests live elsewhere.

## Browsers

Tested only in **Google Chrome on macOS** (headless Chrome, the build of 2026-10-19), opened from disk
(`file://`) and served over `http://127.0.0.1`. Edge, Firefox, Safari, Windows and Linux have **not been
tested**. The code feature-detects what it needs (CompressionStream, DecompressionStream, and the File
System Access API for "Reconnect files", which only Chromium browsers have); where something is missing,
choosing or dropping files by hand still works, but this has not been checked in those browsers.

## Three ways to run it

1. **Double-click `index.html`.** It opens from disk (`file://`); tested in Chrome (see above).
   Everything works there, including GEO streaming. Keep `genomes/` and `example/` next to `index.html`.
   An internet connection is needed for the `.hic` reader (loaded from cdn.jsdelivr.net) and for GEO.
   Share links made from a copy opened this way only work on your own computer (see below).

2. **Serve the folder locally.** In a terminal:

   ```
   cd ContactStudio
   python3 -m http.server 8000
   ```

   then open <http://localhost:8000/>. Same features; useful when your browser restricts `file://` pages.
   Share links made from `localhost` also work only on your computer; the share dialog warns about this.

3. **Host it for your lab.** Copy the folder to any static web server (a lab or department server,
   GitHub Pages, Netlify, an S3 bucket). No server code is needed. With GitHub Pages: create a
   repository, add these files, and enable Pages for the main branch; the app is then at
   `https://<user>.github.io/<repository>/`. Share links made from a hosted copy work for anyone.

## Loading data

- **Local files:** drop `.hic` files (any size; only the parts in view are read) and track files anywhere
  on the page, or use **+ Sample**. Files never leave your computer.
- **GEO:** **+ Sample ▾ → From GEO accession…**, type a sample (`GSM7823645`) or a series (`GSE244676`),
  or paste a GEO page or file address, tick the files and press **Add**. Large series are listed 60
  samples at a time (**List the next 60 samples**). `.hic`, bigWig and bigBed files stream in small pieces as you
  browse (typically a few MB for the first view of a 2 GB map); bedGraph, BED and BEDPE files are
  downloaded and parsed in the browser. Only `www.ncbi.nlm.nih.gov` and `ftp.ncbi.nlm.nih.gov` are
  contacted. The status bar shows how much has been read.
- **Other URLs:** **+ Sample ▾ → From URL…** accepts any `https://` address whose server allows web pages
  on other sites to read it (CORS) and, for `.hic`/bigWig/bigBed, supports Range requests. 4DN portal
  download links need a login and do not work; use **From ENCODE / 4DN…** for ENCODE and 4DN files.
  A GEO folder address (`https://ftp.ncbi.nlm.nih.gov/geo/series/GSE63nnn/GSE63525/suppl/`) opens the
  GEO list for that series. A link dragged onto the page opens this dialog with the link in it.

## Public data from ENCODE and 4DN

**+ Sample ▾ → From ENCODE / 4DN…** (contact maps) and **+ Sample ▾ → Add tracks from ENCODE / 4DN…**
(bigWig, bigBed and BED tracks) open one picker: a tab per catalog (ENCODE, 4DN), the assembly (hg38,
hg19 or mm10; it starts at the assembly of the maps you have open and warns when you pick another one;
4DN has no hg19 files), a text filter (name, biosample, assay, target, output type, lab, file or
experiment accession; all words must match, and "HiC", "in-situ" or "lymphoblastoid" work as you would expect)
and a few lists to narrow by (ENCODE maps: output type, assay, biosample; 4DN maps: experiment type,
biosource, lab; tracks: assay, target, biosample, output type). Up to 200 matching files are listed at a
time ("showing 200 of N"), with their experiment (ENCSR… / 4DNES…), replicate (with MAPQ filter, haplotype or
build date where files of one experiment would otherwise look alike), producing lab and size. Files of one
experiment sit together on one background band; single experiments come first, sorted by name, and
aggregates (mega-maps over many cell lines, annotation sets, files outside any experiment, marked
"aggregate") come last. Tick files and press **Add N selected**; maps and tracks then
stream like GEO files (a few MB for the first view of a map of several hundred MB). Tracks over 50 MB (both
catalogs) are marked ⚠: they are slow to stream (plain BED files are downloaded in full, and you are asked before
anything over 100 MB).

- **What is in the lists.** The picker reads prebuilt indexes in `catalogs/` (made with
  `tools/build_catalogs.py` from the ENCODE and 4DN portals; see `tools/catalogs_README.md` in the source
  folder for how to rebuild them). Contact maps: every released ENCODE `.hic` on GRCh38, hg19 and mm10,
  and every open 4DN `.hic` on GRCh38 and GRCm38. Only "contact matrix" and "mapping quality thresholded
  contact matrix" ENCODE maps are listed until you tick **Show all output types** (which adds
  haplotype-specific, fold-change and variant matrices). Tracks: ENCODE signal (fold change over control,
  signal p-value) and peak files (IDR thresholded, conservative, pseudoreplicated and replicated peaks) of
  experiments, with per-replicate files left out where a pooled file covers all replicates (hg38), and
  every released 4DN bigWig, bigBed and BED file on hg38 and mm10. The date the indexes were built is shown
  at the bottom of the picker; files released later are not listed. The current indexes were built on
  2026-10-20 (about 4.2 MB in all; each list is read only when the picker first shows it).
- **What is contacted.** Nothing when the picker opens: the lists are files of this folder. Chosen files
  are read from the consortia's public storage, `encode-public.s3.amazonaws.com` and
  `4dn-open-data-public.s3.amazonaws.com`, without asking (like GEO), and only those two hosts; the
  portals themselves are never contacted (the "portal" links next to an item open the file's page in a
  new tab when you click them). A file that has since been removed answers "This file has moved or been
  withdrawn; the catalog was built on <date>"; look it up on the portal. Sessions and share links store
  the catalog, accession, address and size of each file, so they reopen the same files.
- **Credit.** Figure captions name the files used ("ENCODE ENCFF…", "4DN 4DNFI…") and add "Data from the
  ENCODE project, encodeproject.org" or "Data from the 4D Nucleome Data Portal, data.4dnucleome.org".
  When you publish, also cite the lab that produced the data (the Lab column), as both consortia's data
  use policies ask.
- **Only in this copy.** The Contact Studio page inside Claude shows the menu items, but its picker only
  explains that the catalogs need the standalone copy; it reads no list and contacts neither bucket.

## Other genomes

hg19, hg38 and mm10 genes (and chromHMM for hg19 and hg38) come with the app and work offline. For
35 more assemblies (those of the igv.js genome registry: mouse mm39 and mm9, rat, zebrafish, fly dm6 and
dm3, worm ce11 and ce10, yeast, *S. pombe*, *Arabidopsis* TAIR10, chicken, dog, cow, pig, primates, T2T
hs1, SARS-CoV-2 and others) the genome is recognized from the chromosome lengths in the `.hic` file, or
chosen under **Display ▾ → Genome → Other (registry)…**. The first time, a RefSeq gene file is downloaded
from UCSC (`hgdownload.soe.ucsc.edu`, 0.1–13 MB; dm6 1.3 MB, about a second) and kept in this browser
(IndexedDB, up to about 100 MB, oldest dropped first), so later visits need no download. Gene search
in the locus box works on these genes too. chromHMM is only available for hg19 and hg38.

- Recognition needs three chromosomes of 1 Mb or more whose lengths equal the assembly's exactly (all of
  them for very small genomes); names only break ties. ce10 and ce11 differ by a few bases per chromosome
  and are told apart. Files whose chromosomes are named by accession (`NC_003070.9`) or plainly (`1`,
  `Chr1`) are matched the same way, and gene files are translated to the map's names.
- Without internet access, the map opens without genes and the status bar says "Genes for dm6 need
  internet access to UCSC"; nothing is retried until the page is reloaded. The Contact Studio page inside
  Claude cannot reach UCSC at all; use this standalone copy for these genomes.
- The list of genomes is a snapshot (`genomes/registry.json`, made by `tools/build_registry.py` from the
  GitHub copy of the igv.js registry). Assemblies that are not in it are not supported in this version.

## Dropbox and Google Drive links

Paste share links into **+ Sample ▾ → From URL…** (or drop them on the page). No account, app key or
sign-in is needed.

- **Dropbox** links (`https://www.dropbox.com/scl/fi/…?rlkey=…`, older `…/s/…` links) work as copied:
  the page reads the file from Dropbox's download host (`dl.dropboxusercontent.com`, same path and
  key) in pieces, like a GEO file, at most about 8 requests per second. Sessions and share links keep the
  link as you pasted it. Dropbox limits sharing bandwidth per account (Basic: 20 GB a day); when a link
  is over its limit the page says "Dropbox link paused (bandwidth limit)". Folder links do not work;
  share the file itself.
- **Google Drive** links do not work: Drive does not let web pages read its files, even files shared
  with "Anyone with the link". Download the file from Drive and open it from your computer, or ask for a
  Dropbox link. Changing the sharing setting does not help. (Technical detail: the page still turns Drive
  links into Drive's direct download address, `drive.usercontent.google.com/download?id=…&confirm=t`,
  in case Google changes this back; since October 2026 Drive answers 403 to every request that a browser
  marks as coming from another site.)
- A recipient who opens a session or share link naming Dropbox or Drive files is asked first, like for
  any other server ("Dropbox (dl.dropboxusercontent.com)").
- **Dropbox Chooser (optional):** with a Dropbox app key (create an app at
  <https://www.dropbox.com/developers/apps>, add the address where you host this folder under "Chooser /
  Saver / Embedder domains"; the key is a public identifier) set `CONFIG.dropboxAppKey` near the top of the
  script in `index.html`, and **From URL…** shows a **Choose from Dropbox…** button. It only appears on a
  hosted copy (http/https), never when the page is opened from disk.

## Sessions and sharing

- **Session ▾ → Save** keeps the session in this browser; **Export .json** writes a file you can send.
- **Session ▾ → Share link…** makes a link (`…/index.html#s=…`) that contains the whole session (views,
  windows, samples, tracks, display settings) in compressed form. Whoever opens it sees the same views;
  GEO and web files are downloaded from their source when the link is opened. Local files stay on your
  computer: the recipient is asked to choose their own copies (matched by file name and size). Data of
  small local track files go into the link only if you tick the box in the share dialog (it shows how
  much the link grows); otherwise the recipient sees a note asking for them. Links hold up to 8 KB;
  larger sessions are shared as a session file instead (session files are limited to 25 MB).
- **Opening a link** when the page has unsaved changes (or this browser holds an unsaved draft) first
  asks whether to keep the current session or open the link. A link that was damaged in transit
  (cut off, a trailing `.` or `)`, percent-encoded by a mail program, broken across lines) is repaired
  when the damage is obvious; otherwise the page says what is wrong and leaves the link in the address
  bar so it can be copied.
- **Reopening local files:** in Chrome (other browsers untested), files you open with **+ Sample** or by dropping them are
  remembered (the browser stores a permission handle, never the file contents). When you reopen a session,
  a **Reconnect N files** button asks the browser for permission for all of them with one click and
  reattaches files whose name and size (and date, when known) match. A stored file with the same name but
  another size or date is only offered for confirmation. A file that was moved or deleted is reported
  once in plain words, with **Choose files…** to pick it again. Without that API (Firefox, Safari:
  untested), choose or drop the files again; they are matched by name and size.

## Privacy and security

The app has no server, and it never sends your maps, tracks or sessions anywhere. What it does contact:

- **At every page start: Google Fonts** (`fonts.googleapis.com` and `fonts.gstatic.com`), for the two
  typefaces of the page. Google receives your IP address, the browser's user agent and, when the page is
  served from a web server, its address (as the referrer), as for any web font; nothing about your data. Without network the page
  falls back to the system fonts.
- **When the first .hic map is opened:** the .hic reader (hic-straw) from `cdn.jsdelivr.net`, once.
- **Only on your action:** GEO (Load from GEO…, GEO sessions), the ENCODE and 4DN buckets (From ENCODE /
  4DN…, sessions naming those files), UCSC `hgdownload.soe.ucsc.edu` (gene files when you choose, or the
  page detects, a genome other than hg19, hg38 and mm10), Dropbox and other servers whose links you paste
  or whose files a session names (after asking, see below). Each of these sees your IP address and which
  file is read, nothing else.

It reads GEO records and files over HTTPS only, renders
everything it reads as plain text, and checks every imported session or link against a fixed schema
(unknown fields dropped, sizes bounded, only GEO or `https://` sources accepted; ENCODE and 4DN entries
only when they point at their own bucket). A session or link that names files on servers other than GEO
and the ENCODE and 4DN buckets lists those servers and asks before anything is requested from them (the
answer holds until the page is closed). The catalog indexes are treated as untrusted data too: every row
is checked (accession format, address on the catalog's own bucket, size a whole number) and shown as plain
text. Gene files for other genomes are read only from UCSC
(`hgdownload.soe.ucsc.edu`), without asking, like GEO. Redirects are not followed automatically: when a server
answers with a redirect, the page stops and asks whether to follow it. Browsers do not reveal where a
redirect points until it is followed, so agreeing contacts the destination (it sees your IP address and
which file is asked for); if that destination is neither GEO nor a server you allowed, you are asked again
and nothing it sent is used unless you agree. GEO requests do not follow redirects at all.

## Files

- `index.html` — the app (one file).
- `genomes/` — chromosome-size-matched annotations: RefSeq genes for hg19, hg38 and mm10; Roadmap
  chromHMM (GM12878 E116, K562 E123) for hg19 and hg38; `registry.json`, the list of the 35 other
  assemblies (chromosome lengths and where their gene files are). Each file also has a `.js` copy used
  when the page is opened from disk (browsers do not let `file://` pages read other files with fetch).
- `catalogs/` — the ENCODE and 4DN indexes for **From ENCODE / 4DN…**: `index.json` (build date, row
  counts, credits) and one `<catalog>.<assembly>.<maps|tracks>.json.gz` per list, each with a `.js` copy
  for `file://`.
- `example/test_chr22.hic` — a 2 MB example map (hic-straw test data).
