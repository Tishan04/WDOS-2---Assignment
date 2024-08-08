document.addEventListener('DOMContentLoaded', initialize);

let cart = {};
let favourites = {};
let cart_table;
let total_amount;

function initialize() {
    cart = JSON.parse(localStorage.getItem('cart')) || {};
    favourites = JSON.parse(localStorage.getItem('favourites')) || {};
    cart_table = document.getElementById('cart_table');
    total_amount = document.getElementById('total_amount');

    display_cart_table();
    update_total();

    // Function to add event listener to an input
    function addProductInputEventListener(input) {
        input.addEventListener('input', handle_product_quantity_change);
    }

    // Select all product input elements
    const product_inputs = document.querySelectorAll('.amount');

    // Add event listeners to all product input elements
    product_inputs.forEach(addProductInputEventListener);

    document.getElementById('add_to_favourites_button').addEventListener('click', save_to_favourites);
    document.getElementById('apply_favourites_button').addEventListener('click', apply_favourites);
    document.getElementById("deliveryButton").addEventListener("click", displayDeliveryMessage);
}

function handle_product_quantity_change(event) {
    let product_element = event.target.closest('.product');
    let product_name = product_element.getAttribute('data-name');
    let product_price = parseFloat(product_element.getAttribute('data-price'));
    let quantity = parseInt(event.target.value);

    if (quantity > 0) {
        cart[product_name] = {
            name: product_name,
            price: product_price,
            quantity: quantity
        };
    } else {
        delete cart[product_name];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    display_cart_table();
    update_total();
}

function handle_quantity_change(event) {
    let product_name = event.target.getAttribute('data-name');
    let quantity = parseInt(event.target.value);

    if (quantity > 0) {
        cart[product_name].quantity = quantity;
    } else {
        delete cart[product_name];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    display_cart_table();
    update_total();
}

function save_to_favourites() {
    favourites = { ...cart };
    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert('Favourites saved!');
}

function apply_favourites() {
    cart = { ...favourites };
    localStorage.setItem('cart', JSON.stringify(cart));
    display_cart_table();
    update_total();
}

function display_cart_table() {
    cart_table.innerHTML = '';

    if (Object.keys(cart).length === 0) {
        cart_table.innerHTML = "Your Cart is Empty.";
        return;
    }

    let table = document.createElement('table');
    let header_row = document.createElement('tr');
    let headers = ['Name', 'Price Per Unit', 'Quantity', 'Total'];

    headers.forEach(function(header_text) {
        let header = document.createElement('th');
        let text_node = document.createTextNode(header_text);
        header.appendChild(text_node);
        header_row.appendChild(header);
    });

    table.appendChild(header_row);

    Object.keys(cart).forEach(function(product_name) {
        const product = cart[product_name];
        let row = document.createElement('tr');

        let cells = [
            product.name,
            'Rs.' + product.price,
            '<input type="number" class="amount" value="' + product.quantity + '" min="0" data-name="' + product_name + '">',
            'Rs.' + (product.price * product.quantity).toFixed(2)
        ];

        cells.forEach(function(cell_content) {
            let cell = document.createElement('td');
            if (cell_content.startsWith('<input')) {
                cell.innerHTML = cell_content;
            } else {
                let text_node = document.createTextNode(cell_content);
                cell.appendChild(text_node);
            }
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    cart_table.appendChild(table);

    // Function to add event listener to an input
    function addInputEventListener(input) {
        input.addEventListener('input', handle_quantity_change);
    }

    // Select all quantity input elements
    let quantity_inputs = document.querySelectorAll('.amount');

    // Add event listeners to all quantity input elements
    quantity_inputs.forEach(addInputEventListener);
}


// Define the callback function separately
function calculateTotal(product) {
    total += product.price * product.quantity;
}

// Declare a variable to hold the total amount
let total = 0;

// Define the update_total function
function update_total() {
    total = 0; // Reset total to 0 before calculation
    Object.values(cart).forEach(calculateTotal);
    total_amount.innerHTML = 'Total Amount: Rs.' + total.toFixed(2) + ' /=';
}


document.getElementById("orderForm").addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form submission
    displayDeliveryMessage();
}

function displayDeliveryMessage() {
    // Get today's date
    let today = new Date();

    // Calculate the delivery date (4 days from today)
    let delivery_date = new Date(today);
    delivery_date.setDate(today.getDate() + 4);

    // Format the delivery date
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formatted_date = delivery_date.toLocaleDateString(undefined, options);

    // Display the message
    let message = `Thank You for Shopping with Grocies. Your order will be delivered to your doorstep on ${formatted_date}.`;
    document.getElementById("deliveryMessage").innerText = message;
}