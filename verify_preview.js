const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('🚀 Verifying 576-Frame Scroll...');
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        let failedReqs = 0;
        page.on('requestfailed', () => failedReqs++);
        page.on('pageerror', err => console.log(`PAGE ERROR: ${err.message}`));

        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });

        // Poll loading progress every 5 seconds, up to 120s
        for (let i = 0; i < 24; i++) {
            await new Promise(r => setTimeout(r, 5000));
            const loaded = await page.evaluate(() => window.state?.imagesLoaded || 0);
            const total = await page.evaluate(() => window.CONFIG?.TOTAL_FRAMES || 0);
            const pct = total > 0 ? Math.round(loaded / total * 100) : 0;
            process.stdout.write(`\r  Loading: ${loaded}/${total} (${pct}%)  `);
            if (loaded >= total && total > 0) break;
        }
        console.log('');

        const s = await page.evaluate(() => ({
            loaded: window.state?.imagesLoaded || 0,
            total: window.CONFIG?.TOTAL_FRAMES || 0,
            done: !window.state?.isLoading,
            sky0: !!window.state?.frames[0],
            sky191: !!window.state?.frames[191],
            side192: !!window.state?.frames[192],
            side383: !!window.state?.frames[383],
            exp384: !!window.state?.frames[384],
            exp575: !!window.state?.frames[575],
        }));

        console.log(`\n📊 RESULTS:`);
        console.log(`  Loaded: ${s.loaded}/${s.total} | Done: ${s.done}`);
        console.log(`  Sky[0]:${s.sky0} Sky[191]:${s.sky191}`);
        console.log(`  Side[192]:${s.side192} Side[383]:${s.side383}`);
        console.log(`  Exp[384]:${s.exp384} Exp[575]:${s.exp575}`);
        console.log(`  Failed requests: ${failedReqs}`);

        if (s.done && s.loaded >= 550) {
            console.log('\n✅ FRAMES LOADED! Taking screenshots...');
            await page.screenshot({ path: 'v_hero.png' });

            await page.evaluate(() => window.scrollTo(0, 2500));
            await new Promise(r => setTimeout(r, 1000));
            await page.screenshot({ path: 'v_sky.png' });

            await page.evaluate(() => window.scrollTo(0, 6000));
            await new Promise(r => setTimeout(r, 1000));
            await page.screenshot({ path: 'v_side.png' });

            await page.evaluate(() => window.scrollTo(0, 11000));
            await new Promise(r => setTimeout(r, 1000));
            await page.screenshot({ path: 'v_expansion.png' });

            console.log('  Screenshots: v_hero.png, v_sky.png, v_side.png, v_expansion.png');
        } else {
            console.log('\n⚠️ Not fully loaded. Screenshot of current state:');
            await page.screenshot({ path: 'v_loading.png' });
        }

        await browser.close();
        console.log('✨ Done.');
    } catch (e) {
        console.error('❌', e.message);
        process.exit(1);
    }
})();
