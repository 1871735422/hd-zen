/**
 * Font Subsetting Script
 * Generates optimized font subsets containing only the characters used in the project
 *
 * Characters used: 第一二三四五六七八九十册
 * Original size: ~2M -> Optimized size: ~50-100KB
 *
 * Usage: pnpm font:subset
 */

const Fontmin = require('fontmin');
const path = require('path');
const fs = require('fs');

// Characters used in the application
const CHARS = '第一二三四五六七八九十册空性寂止的修法';

async function subsetFont() {
  const fontSourceUrl =
    'https://d2e6j3zdpz3g2k.cloudfront.net/fhfy/cdn/fonts/北方行书.woff2';
  const outputDir = path.join(__dirname, '../public/fonts/subsets');
  const fontName = 'BeiFangXingShu';

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🔤 Font Subsetting Process');
  console.log(`📥 Source: ${fontSourceUrl}`);
  console.log(`📝 Characters: ${CHARS}`);
  console.log(`💾 Output: ${outputDir}`);
  console.log('---');

  try {
    // Download the font first
    const tempDir = path.join(__dirname, '../.temp-fonts');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fontPath = path.join(tempDir, '北方行书.ttf');

    // If font doesn't exist locally, you need to download it manually
    if (!fs.existsSync(fontPath)) {
      console.log('⚠️  TTF font file not found locally');
      console.log('Please place the TTF font file at:');
      console.log(fontPath);
      return;
    }

    // Use fontmin to subset the font with proper configuration
    const fontmin = new Fontmin()
      .src(fontPath)
      .dest(outputDir)
      .use(
        Fontmin.glyph({
          text: CHARS,
          hinting: false, // Disable hinting for smaller size
        })
      )
      .use(Fontmin.ttf2woff2());

    fontmin.run((err, files) => {
      if (err) {
        console.error('❌ Error:', err);
        process.exit(1);
      }

      console.log('✅ Font subsetting completed!');
      console.log(`📦 Generated files:`);
      files.forEach(file => {
        const stats = fs.statSync(file.path);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   - ${path.basename(file.path)} (${sizeKB} KB)`);
      });

      console.log('\n📌 Update globals.css with:');
      console.log(`
@font-face {
  font-family: 'BeiFangXingShu';
  src: url('/fonts/subsets/北方行书.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
      `);
    });
  } catch (error) {
    console.error('❌ Process failed:', error);
    process.exit(1);
  }
}

subsetFont();
