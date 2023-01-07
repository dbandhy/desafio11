const socket = io();
//import socket from "io"

const $tableProducts = document.querySelector('#table-products');

const renderProducts = products => {
	if (products.length > 0) {
		$tableProducts.innerHTML = '';
		products.forEach(product => {
			$tableProducts.innerHTML += `
		<tr class="text-center">
			<td class="align-middle">${product.name}</td>
			<td class="align-middle">${product.price}</td>
			<td class="align-middle">
				<img src="${product.img}" alt="${product.name}" width="100px">
			</td>
		</tr>`;
		});
	} else {
		$noProducts.style.display = 'block';
	}
}

socket.on('products', products => {
	renderProducts(products);
});