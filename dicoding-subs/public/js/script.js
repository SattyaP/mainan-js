// CONFIRMATION ENV HANYA SAYA GUNAKAN UNTUK TUGAS SAJA PRODUCTION SAYA TIDAK MENGGUNAKAN CARA SEPERTI INI TERIMAKASIH
const env = {
    clientId: 'fd36b49bb92d49fca774a9b38eb19ed8',
    clientSecret: 'b5b0142c00194220b4d65873a38e30a7',
    userId: '31awtprxdl775pfbt77odonlvnre'
}

const idArtist = ['06HL4z0CvFAxyc27GXpf02', '2EoyTW14yqnbqmk90NjbLT', '00FQb4jTyendYWaN8pK0wa', '0ZUvK7zGdXLd78mQr3t1Tw', '51kyrUsAVqUBcoDEMFkX12']

class Spotify {
    async fetchData(param, accessToken) {
        const response = await fetch(`https://api.spotify.com/${param}`, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    }

    async getAccessToken(env) {
        const requestBody = new URLSearchParams();
        requestBody.append('grant_type', 'client_credentials');
        requestBody.append('client_id', env.clientId);
        requestBody.append('client_secret', env.clientSecret);

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async getProfile(accessToken, env) {
        const param = `v1/users/${env.userId}`
        return await this.fetchData(param, accessToken);
    }

    async getPlaylist(accessToken) {
        const param = 'v1/playlists/0Uwj8lEBj65wAMYkLMUj4B'
        return await this.fetchData(param, accessToken);
    }

    async favoriteArtists(accessToken) {
        let data = []
        for (let i = 0; i < idArtist.length; i++) {
            const param = `v1/artists/${idArtist[i]}`
            data.push(await this.fetchData(param, accessToken))
        }
        return data;
    }
}

const spotify = new Spotify();

async function renderProfile(accessToken) {
    const profile = await spotify.getProfile(accessToken, env);
    document.getElementById('profile').src = profile.images[0].url
    document.querySelector('header > div > p').innerHTML = profile.display_name.replace('.', '')
}

async function renderArtis(accessToken) {
    const artists = await spotify.favoriteArtists(accessToken);
    const opening = document.querySelector('.main-opening')
    const based = (name, src, desc) => `<article>
    <img src="${src}" alt="${name}-picture">
    <h5>${name}</h5>
    <p>Genres : ${desc}</p>
    </article>`
    const openingContent = artists.map(data => based(data.name, data.images[2].url, data.genres)).join('');
    opening.innerHTML = openingContent;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Update year footer
    // document.getElementById("year").innerHTML = new Date().getFullYear();
    
    const accessToken = await spotify.getAccessToken(env);
    await renderProfile(accessToken)
    await renderArtis(accessToken)

})