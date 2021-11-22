Model = {}

Model.products = [{
    _id: 1,
    title: 'Halo Infinite',
    url: '/assets/img/games/halo-infinite.webp',
    description: 'When all hope is lost and humanity’s fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he’s ever faced. Step inside the armor of humanity’s greatest hero to experience an epic adventure and explore the massive scale of the Halo ring.',
    price: 59.99
},
{
    _id: 2,
    title: 'Age of Empires IV',
    url: '/assets/img/games/aoe-iv.webp',
    description: 'One of the most beloved real-time strategy games returns to glory with Age of Empires IV, putting you at the center of epic historical battles that shaped the world. Featuring both familiar and innovative new ways to expand your empire in vast landscapes with stunning 4K visual fidelity, Age of Empires IV brings an evolved real-time strategy game to a new generation.',
    price: 59.99
},
{
    _id: 3,
    title: 'Assassin\'s Creed Valhalla',
    url: '/assets/img/games/ac-valhalla.webp',
    description: 'Become Eivor, a Viking raider raised to be a fearless warrior, and lead your clan from icy desolation in Norway to a new home amid the lush farmlands of ninth-century England. Find your settlement and conquer this hostile land by any means to earn a place in Valhalla.',
    price: 59.99
},
{
    _id: 4,
    title: "Forza Horizon 5",
    url: '/assets/img/games/fh5.webp',
    description: 'In this game, you can explore a truly massive open world map, as much as fifty percent larger than Forza Horizon 4’s not inconsiderable map. Race a variety of vehicles through a volcanos’ caldera, explore jungles and rainforests for their hidden ruined cities, spray sand up as you zoom over beaches, as well as racing past waterfalls, snowy mountains, and large reality-based cities like Guanajuato which comes with a network of secret tunnels to explore!',
    price: 59.99
},
{
    _id: 5,
    title: "Far Cry 6",
    url: '/assets/img/games/far-cry-6.webp',
    description: 'Far Cry 6 is set on the fictional Caribbean island of Yara, a first person shooter in an open world location. The game boasts the largest Far Cry map to date which you can cross on foot or in a nicely diverse range of vehicles, and – thanks to the determined efforts of El Presidente – the tropical paradise is frozen in time. This is to prevent the populace getting ideas about independence and free and fair elections and other such nonsense, of course...',
    price: 59.99
},
{
    _id: 6,
    title: "Marvel's Guardians of the Galaxy",
    url: '/assets/img/games/guardians.webp',
    description: 'Marvel’s Guardians of the Galaxy is a single player, narrative driven, episodic game with a fairly linear premise. It is strongly mission based, and the story is loosely based on the comic book series of the same name. There are movies in the franchise which use the same characters as are featured in the game and the original comics.',
    price: 59.99
}];

Model.getTitle = function (productId) {
    return this.findProduct_knowingId(productId).title
}

Model.user = null;

Model.users = [{
    _id: 1,
    email: 'johndoe@example.com',
    password: '1234',
    name: 'John',
    surname: 'Doe',
    birth: new Date(1990, 1, 1),
    address: '123 Main St, 12345 New York, USA',
    shoppingCart: [/*{
        qty: 1,
        product: 'product 1',
        price: '60'
    }*/],
    orders: []
}];

Model.getUserShoppingCart = function () {
    return this.user.shoppingCart
}

Model.emptyShoppingCart = function () {
    // Elimina todos los items y limpia la lista
    this.user.shoppingCart.splice(0, this.user.shoppingCart.length)
}

Model.tax = 0.21;

/* Sign In */
Model.signin = function (email, password) {
    Model.user = null;
    for (var i = 0; i < Model.users.length; i++) {
        if (Model.users[i].email == email && Model.users[i].password == password) {
            Model.user = Model.users[i];
            break;
        }
    }
}

/* Sign Up */
Model.signup = function (newUserData) {
    Model.user = null;

    // Comprobar que el correo no existe en la lista users
    if (!this.isEmailRegistered(newUserData.email)) {
        // Crear el nuevo usuario
        let newUser = {
            _id: this.searchMaxId_inUsersList() + 1,
            email: newUserData.email,
            password: newUserData.password,
            name: newUserData.name,
            surname: newUserData.surname,
            birth: newUserData.birth,
            address: newUserData.address,
            shoppingCart: [],
            orders: []
        }

        // Añadir el nuevo usuario a la lista users
        this.users.push(newUser);

        // Devolvemos el nuevo usuario
        return newUser;
    }

    // Si el correo ya existe, devolvemos null
    return null;
}

/* Sign Out */
Model.signout = function () {
    Model.user = null;
}

Model.isEmailRegistered = function (email) {
    for (var i = 0; i < Model.users.length; i++) {
        if (Model.users[i].email == email) {
            // Lo encuentra
            return true;
        }
    }

    // No lo encuentra
    return false;
}

Model.searchMaxId_inUsersList = function () {
    let maxId = Model.users[0]._id;

    for (var i = 0; i < Model.users.length; i++) {
        if(Model.users[i]._id > maxId) {
            maxId = Model.users[i]._id;
        }
    }

    return maxId;
}

/* Buy */
Model.buy = function (productID) {
    // Buscar el producto en el shoppingCart de user
    let productInCart = this.findProduct_inCart(productID)

    // Si el producto está en el shoppingCart
    if (productInCart) {
        // Aumentamos en 1 su qty
        productInCart.qty++;

        // Actualizamos el precio total
        productInCart.total += productInCart.price;
    }
    else {
        // Buscar el producto en la lista products
        let p_inProductList = this.findProduct_inProductsList(productID)

        // Añadimos el producto al shoppingCart
        let newItem = {
            _id: p_inProductList._id,
            qty: 1,
            title: p_inProductList.title,
            price: p_inProductList.price,
            total: p_inProductList.price
        }

        this.user.shoppingCart.push(newItem);
    }
}

Model.findProduct_inCart = function (productID) {
    return this.user.shoppingCart.find(item => item._id == productID)
}

Model.findProduct_knowingId = function (productId) {
    return this.products.find(product => product._id == productId)
}

Model.findProduct_inProductsList = function (productID) {
    return this.products.find(item => item._id == productID)
}

Model.findOrder_knowingNumber = function (number) {
    return this.user.orders.find(order => order.number == number)
}

/* DeleteOne de Cart */
Model.deleteOne = function (productID) {
    // Buscar el producto en el shoppingCart de user
    let productInCart = this.findProduct_inCart(productID)

    // Si solo hay 1 producto, lo eliminamos del shoppingCart de user
    if (productInCart.qty == 1) {
        // índice del producto en shoppingCart
        let productIndex = this.findIndex_knowingID(this.user.shoppingCart, productID)

        // eliminar el producto de shoppingCart
        this.user.shoppingCart.splice(productIndex, 1)
        
        return undefined
    }
    else {
        // restar 1 a su qty
        productInCart.qty--;
        
        // actualizar su total
        productInCart.total -= productInCart.price;

        return productInCart
    }
}

/* DeleteAll de Cart */
Model.deleteAll = function (productID) {
    // índice del producto en shoppingCart
    let productIndex = this.findIndex_knowingID(this.user.shoppingCart, productID)

    // eliminar el producto de shoppingCart
    this.user.shoppingCart.splice(productIndex, 1)
}

Model.findIndex_knowingID = function (list, ID) {
    return list.findIndex(item => item._id == ID)
}

// Para el badge de cart
Model.getTotalQty = function () {
    let totalQty = 0;

    for(item of this.user.shoppingCart) {
        totalQty += item.qty
    }

    return totalQty
}

// Calcular subtotal
Model.getSubtotal = function () {
    let subtotal = 0;

    for (item of this.user.shoppingCart) {
        subtotal += item.total
    }

    return subtotal
}

// Añadir el tax al price
Model.getSubtotal_addedTax = function () {
    return this.getSubtotal()*this.tax
}

// Calcular total (subtotal + tax)
Model.getTotal_ofOrder = function (itemList) {
    let total = 0;

    // Recorremos la lista de items de la Order
    for (item of itemList) {
        total += (item.price + (item.price * this.tax)) * item.qty
    }

    return total
}

Model.getSubtotal_ofOrder = function (itemList) {
    let subtotal = 0;

    for (item of itemList) {
        subtotal += item.price * item.qty
    }

    return subtotal
}

Model.getTax_ofOrder = function (itemList) {
    let tax = 0;

    for (item of itemList) {
        tax += (item.price * item.qty) * this.tax
    }

    return tax
}

Model.getTotal_ofOrderItem = function (itemQty, itemPrice) {
    return (itemPrice + (itemPrice * this.tax)) * itemQty
}

/* Purchase */
Model.purchase = function (purchaseForm, IDitemList, purchaseNumber) {
    // Nueva order
    let newOrder = {
        number: purchaseNumber,
        date: purchaseForm.date,
        address: purchaseForm.address,
        cardNumber: purchaseForm.cardNumber,
        cardOwner: purchaseForm.cardOwner,
        itemList: [/*itemID, qty, price*/]
    }

    // Construimos los orderItems
    for (id of IDitemList) {
        // Buscamos el item en la lista de Productos
        let item = this.findProduct_inProductsList(id)

        // Buscamos el item en la shoppingCart para obtener qty
        let orderQty = this.findProduct_inCart(id).qty

        // Añadimos el item a la itemsList de order
        newOrder.itemList.push({
            itemID: item._id,
            qty: orderQty,
            price: item.price
        });
    }

    // Añadir el order al user
    this.user.orders.push(newOrder)

    // Vaciamos el shoppingCart
    this.emptyShoppingCart();
}

Model.getOrder = function (number) {
    return this.findOrder_knowingNumber(number)
}