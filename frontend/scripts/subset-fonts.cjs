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
const CHARS =
  '亲爱的朋友们:在学修佛法的过程中，如果您有疑惑，欢迎提出问题，一起探讨！参与方式:请扫描下方二维码或点击问卷链接填写您的问题。';

async function subsetFont() {
  const outputDir = path.join(__dirname, '../public/fonts/subsets');
  const fontName = 'FangZhengQiTi';

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📝 Characters: ${CHARS}`);
  console.log(`💾 Output: ${outputDir}`);

  try {
    const fontPath = path.join('.', '方正启体简体.TTF');

    // If font doesn't exist locally, you need to download it manually
    if (!fs.existsSync(fontPath)) {
      console.log('⚠️  TTF font file not found locally');
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
      files.forEach(file => {
        const stats = fs.statSync(file.path);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   - ${path.basename(file.path)} (${sizeKB} KB)`);
      });

      console.log('\n📌 Update globals.css with:');
      console.log(`
@font-face {
  font-family: '${fontName}';
  src: url('/fonts/subsets/${fontName}.woff2') format('woff2');
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
