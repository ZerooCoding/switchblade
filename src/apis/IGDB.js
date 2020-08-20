const { APIWrapper } = require('../')

const fetch = require('node-fetch')
const qs = require('querystring')
const { URLSearchParams } = require('url')

const API_URL = 'https://api-v3.igdb.com'

module.exports = class IGDB extends APIWrapper {
  constructor() {
    super({
      name: 'igdb',
      envVars: ['IGDB_API_KEY']
    })
  }

  searchGame (gameName) {
    return this.request('/games', `fields name,slug; search: "${gameName}";`)
  }

  getGameById (gameId) {
    return this.request('/games', `fields name,cover.url,genres.name,platforms.name,release_dates.date,release_dates.platform.name,release_dates.region,age_ratings.*,alternative_names.name,dlcs.*,expansions.*,involved_companies.company.name,popularity,similar_games.*,total_rating,total_rating_count,url,summary; where id = ${gameId};`).then(g => g[0])
  }

  getCoverUrl (coverId) {
    return this.request('/covers', `fields url; where id = ${coverId};`).then(c => `https:${c[0].url}`)
  }

  request (endpoint, data) {
    return fetch(API_URL + endpoint, {
      method: 'POST',
      headers: {
        'user-key': process.env.IGDB_API_KEY
      },
      body: data
    }).then(res => res.json())
  }
}