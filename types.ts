import { Symbol } from 'typescript';

const TYPES = {
    UserService: Symbol.for('UserService'),
    UserInfoService: Symbol.for('UserInfoService'),
    AuthenticationService: Symbol.for('AuthenticationService'),
    PurchaseService: Symbol.for('PurchaseService'),
    CurrencyService: Symbol.for('CurrencyService'),
    DishService: Symbol.for('DishService'),
    IngredientService: Symbol.for('IngredientService'),
};

export { TYPES };
