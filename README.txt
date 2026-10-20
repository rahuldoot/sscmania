SSC MANIA — MODULAR WEBSITE

FILES
- index.html: website pages and layout
- style.css: design and responsive layout
- app.js: navigation, chapter list, test engine, timer, scoring and review
- assets/ssc-mania-logo.jpg: the exact original logo image supplied by the owner
- chapters/making-of-constitution.json: Chapter 1 question bank
- chapters/salient-features.json: Chapter 2 question bank

HOW TO ADD OR EDIT QUESTIONS
1. Open the relevant JSON file inside chapters/.
2. Follow the existing question format exactly: topic, difficulty, q, opts (4 options), a (correct answer index 0-3), exp (explanation).
3. Save and upload the changed JSON file to the same path in GitHub.

HOW TO ADD A NEW CHAPTER
1. Create a new JSON file inside chapters/ and give it the same structure as an existing chapter file.
2. In app.js, add one object to the chapters array at the top, for example:
   {title:'New Chapter Title',subject:'Polity',file:'chapters/new-chapter.json'}
3. Commit both files to GitHub. The chapter appears automatically in the chapter dropdown when its subject is selected.

HOW TO CHANGE LINKS
- YouTube and Telegram links are in index.html, inside section id="about".

HOW TO UPDATE GITHUB PAGES
1. Download and extract the ZIP.
2. Upload the contents of the SSC_Mania_Modular folder to the repository root, preserving folders.
3. Ensure index.html is at the repository root and the chapters/ and assets/ folders remain in place.
4. Commit changes. Test on the GitHub Pages website.

IMPORTANT
- Do not upload only index.html. CSS, JavaScript, assets, and chapters are required.
- Chapter data is separate from the UI, so question changes normally do not require changing the design.
