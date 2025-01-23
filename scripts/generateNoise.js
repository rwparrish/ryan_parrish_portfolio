import sharp from 'sharp';

const width = 512;
const height = 512;
const channels = 4;
const data = new Uint8Array(width * height * channels);

// Generate noise
for (let i = 0; i < data.length; i += 4) {
    const value = Math.floor(Math.random() * 255);
    data[i] = value;     // R
    data[i + 1] = value; // G
    data[i + 2] = value; // B
    data[i + 3] = 255;   // A
}

sharp(data, {
    raw: {
        width,
        height,
        channels
    }
})
.blur(2) // Smooth the noise a bit
.toFile('public/noise.png')
.then(() => console.log('Noise texture generated!'))
.catch(err => console.error('Error generating noise:', err));
