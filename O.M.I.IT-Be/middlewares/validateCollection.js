const validateCollection = (req, res, next) => {
    const errors = []

    const {gameTitle,developer,publisher,genres,releaseDate,platforms} = req.body;

    if (typeof gameTitle !== 'string') {
        errors.push('GameTitle must be a string') }

    if (typeof developer !== 'string') {
        errors.push('Developer must be a string') }

    if (typeof publisher !== 'string') {
        errors.push('Publisher must be a string') }

    if (typeof genres !== 'string') {
        errors.push('Genres must be a string') }

    if (typeof releaseDate !== 'string') {
        errors.push('ReleaseDate must be a string') }

    if (typeof platforms !== 'string') {
        errors.push('Platforms must be a string') }

    if (errors.length > 0) {
        res.status(400).send({ errors } )
    } else {
        next() } }

module.exports = validateCollection