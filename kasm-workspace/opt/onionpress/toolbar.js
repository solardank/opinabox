// /opt/onionpress/toolbar.js
(async () => {
  const publishBtn = document.getElementById('publish');
  const statusEl = document.getElementById('status');
  const qrImg = document.getElementById('qr');
  const seedarea = document.getElementById('seedarea');

  function showStatus(msg, isError=false) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? '#ffb4b4' : '#d1e7ff';
    console.log(msg);
  }

  function showQR(dataURL) {
    qrImg.src = dataURL;
  }

  async function makeQrData(payload) {
    // simple local QR generator using chart.googleapis (quick dev)
    const json = JSON.stringify(payload);
    // Use Google Chart API (dev only). Replace with a client QR lib if desired.
    return `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(json)}`;
  }

  publishBtn.onclick = async function() {
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();
    const freeText = document.getElementById('freeText').value.trim();

    if (!title || !url) {
      showStatus('Please enter both Title and URL', true);
      return;
    }

    // create ephemeral wallet (dev local only)
    const wallet = ethers.Wallet.createRandom();
    const ephemeralAddr = wallet.address;
    const ephemeralPriv = wallet.privateKey;

    showStatus('Created ephemeral wallet ' + ephemeralAddr);

    // build metadata object — you can also store this in IPFS and pass metadataURI
    const metadata = {
      title,
      url,
      notes: freeText,
      createdAt: new Date().toISOString()
    };

    // If you have an IPFS upload step, do it here and set metadataURI.
    // For now we'll post metadata inline for dev (control-api must accept it).
    const body = {
      to: ephemeralAddr,
      metadata,
    };

    showStatus('Calling control-api to mint...');

    try {
      // POST to control-api running in compose; adjust origin if needed.
      const resp = await fetch('http://localhost:3000/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        showStatus('Mint failed: ' + resp.status + ' ' + txt, true);
        return;
      }

      const data = await resp.json();
      showStatus('Mint success: tokenId=' + (data.tokenId ?? 'n/a') + ' tx=' + (data.txHash ?? 'n/a'));

      // show QR so journalist can photograph it — include ephemeral priv for dev flows.
      const qrPayload = {
        tokenId: data.tokenId,
        txHash: data.txHash,
        address: ephemeralAddr,
        ephemeralPriv // WARNING: dev-only, do not reveal in prod unless encrypted
      };

      const qurl = await makeQrData(qrPayload);
      showQR(qurl);

      seedarea.innerHTML = `<pre style="background:#07111a;color:#bfe1ff;padding:8px;border-radius:6px">Ephemeral address: ${ephemeralAddr}\nPrivate key (dev only): ${ephemeralPriv}</pre>`;

    } catch (err) {
      console.error(err);
      showStatus('Mint failed: ' + (err.message||err), true);
    }
  };
})();
