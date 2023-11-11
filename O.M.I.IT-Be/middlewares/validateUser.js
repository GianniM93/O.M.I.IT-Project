const validateUser = (req, res, next) => {
    const errors = []

    const {firstName,lastName,email,birthDate} = req.body;

    if (typeof firstName !== 'string') {
        errors.push('FirstName must be a string') }

    if (typeof lastName !== 'string') {
        errors.push('LastName must be a string') }

    if (typeof email !== 'string') {
        errors.push('Email must be a string') }

    if (typeof birthDate !== 'string') {
        errors.push('BirthDate must be a string') }

    if (errors.length > 0) {
        res.status(400).send({ errors } )
    } else {
        next() } }

module.exports = validateUser