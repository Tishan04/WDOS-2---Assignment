// Wait until the DOM is fully loaded before initializing.
document.addEventListener('DOMContentLoaded', initialize);

let cart = {}; // Object to store products added to the cart
let favourites = {}; // Object to store user's favourite products
let cart_table; 
let total_amount;

function initialize() {
    // Load cart and favourites from localStorage, or initialize them as empty objects
    cart = JSON.parse(localStorage.getItem('cart')) || {};
    favourites = JSON.parse(localStorage.getItem('favourites')) || {};
    cart_table = document.getElementById('cart_table');
    total_amount = document.getElementById('total_amount'); 

    display_cart_table(); // Display the cart table based on the loaded cart
    update_total(); // Update the total amount displayed

    const product_inputs = document.querySelectorAll('.amount');
    product_inputs.forEach(input => input.addEventListener('input', handle_product_quantity_change));

    document.getElementById('add_to_favourites_button').addEventListener('click', save_to_favourites);
    document.getElementById('apply_favourites_button').addEventListener('click', apply_favourites);
    document.getElementById("deliveryButton").addEventListener("click", displayDeliveryMessage);
}

function handle_product_quantity_change(event) {
    let product_element = event.target.closest('.product'); // Find the closest product element
    let product_name = product_element.getAttribute('data-name'); // Get product name
    let product_price = parseFloat(product_element.getAttribute('data-price')); // Get product price
    let quantity = parseInt(event.target.value); // Get the new quantity entered by the user

    if (quantity > 0) {
        // Update the cart with the new quantity
        cart[product_name] = {
            name: product_name,
            price: product_price,
            quantity: quantity
        };
    } else {
        delete cart[product_name];
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    display_cart_table();
    update_total();
}

// Handles changes to product quantities within the cart table
function handle_quantity_change(event) {
    let product_name = event.target.getAttribute('data-name'); // Get the product name
    let quantity = parseInt(event.target.value); // Get the new quantity entered by the user

    if (quantity > 0) {
        cart[product_name].quantity = quantity;
    } else {
        delete cart[product_name];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    display_cart_table();
    update_total();
}

// Saves the current cart to favourites in localStorage
function save_to_favourites() {
    favourites = { ...cart }; // Copy the cart to favourites
    localStorage.setItem('favourites', JSON.stringify(favourites)); // Save to localStorage
    alert('Favourites saved!'); // Notify the user that the favorites is saved
}

// Applies the saved favourites to the cart
function apply_favourites() {
    cart = { ...favourites }; // Copy the favourites to the cart
    localStorage.setItem('cart', JSON.stringify(cart));
    display_cart_table();
    update_total();
}

// Generates and displays the cart table based on the cart data
function display_cart_table() {
    cart_table.innerHTML = ''; // Clear the current table

    if (Object.keys(cart).length === 0) {
        // Display a message if the cart is empty
        cart_table.innerHTML = "Your Cart is Empty.";
        return;
    }

    let table = document.createElement('table'); // Create a new table element
    let header_row = document.createElement('tr'); // Create the header row
    let headers = ['Name', 'Price Per Unit', 'Quantity', 'Total']; // Table headers

    // Create and append each header cell
    headers.forEach(function(header_text) {
        let header = document.createElement('th');
        let text_node = document.createTextNode(header_text);
        header.appendChild(text_node);
        header_row.appendChild(header);
    });

    table.appendChild(header_row); // Add the header row to the table

    // Create a row for each product in the cart
    Object.keys(cart).forEach(function(product_name) {
        let product = cart[product_name];
        let row = document.createElement('tr');

        let cells = [
            product.name,
            'Rs.' + product.price,
            '<input type="number" class="amount" title="quantity" value="' + product.quantity + '" min="0" data-name="' + product_name + '">',
            'Rs.' + (product.price * product.quantity).toFixed(2)
        ];

        // Create and append each cell
        cells.forEach(function(cell_content) {
            let cell = document.createElement('td');
            if (cell_content.startsWith('<input')) {
                // If the content is an input element, add it directly
                cell.innerHTML = cell_content;
            } else {
                // Otherwise, create a text node
                let text_node = document.createTextNode(cell_content);
                cell.appendChild(text_node);
            }
            row.appendChild(cell);
        });

        table.appendChild(row); // Add the row to the table
    });

    cart_table.appendChild(table); // Append the table to the cart_table element

    document.querySelectorAll('.amount').forEach(input => input.addEventListener('input', handle_quantity_change));
}

// Helper function to calculate the total amount of the cart
function calculateTotal(product) {
    total += product.price * product.quantity;
}

let total = 0;

function update_total() {
    total = 0; // Reset total to 0 before calculation
    Object.values(cart).forEach(calculateTotal);
    total_amount.innerHTML = 'Total Amount: Rs.' + total.toFixed(2) + ' /='; 
}

// Prevent form submission if inputs are not filled and display the delivery message
document.getElementById("orderForm").addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault(); // Prevents the form from submitting
    displayDeliveryMessage(); // Display the delivery message after validation
}

// Displays a message with the delivery date after an order is placed
function displayDeliveryMessage() {
    let today = new Date(); // Get the current date
    let delivery_date = new Date(today);
    delivery_date.setDate(today.getDate() + 4); // Set delivery date to 4 days from now

    // Format the delivery date
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formatted_date = delivery_date.toLocaleDateString(undefined, options);

    // Display the delivery message
    let message = `Thank You for Shopping with Grocies.❤ Your order will be delivered to your doorstep on ${formatted_date}.✅`;
    document.getElementById("deliveryMessage").innerText = message;
}

// Disables input fields for card details when cash on delivery is selected
document.addEventListener('DOMContentLoaded', function () {
    const cashOnDeliveryRadio = document.getElementById('radio02');
    const cardPaymentRadio = document.getElementById('radio01');
    const cardDetails = document.querySelectorAll('#Credit, #Expiry, #cvv');

    function toggleCardDetails() {
        cardDetails.forEach(field => field.disabled = cashOnDeliveryRadio.checked);
    }

    toggleCardDetails(); // Initial call to disable/enable fields based on the selection
    cashOnDeliveryRadio.addEventListener('change', toggleCardDetails);
    cardPaymentRadio.addEventListener('change', toggleCardDetails);
});

// Function to enforce numeric-only input on specific fields
function allowOnlyNumbers(input) {
    input.value = input.value.replace(/\D/g, ''); // Remove non-digit characters
}

['Credit', 'cvv', 'phone'].forEach(id => {
    document.getElementById(id).addEventListener('input', function (e) {
        allowOnlyNumbers(this);
    });
});