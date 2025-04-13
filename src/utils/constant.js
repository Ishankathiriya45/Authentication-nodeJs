const appModule = {
    admin: 'admin',
    buyer: 'buyer',
    seller: 'seller',
    bike: 'bike',
}

const permission = {
    admin: {
        [appModule.buyer]: ['create'],
        [appModule.seller]: ['create'],
        [appModule.bike]: ['create', 'read'],
    }
}

module.exports = {
    appModule,
    permission,
}