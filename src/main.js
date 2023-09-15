window.addEventListener("load", function () {
        const overlay=document.querySelector(".overlay");
            setTimeout(function () {
                overlay.classList.add("overlay_hidden"); 
            }, 2000)
            });
           



    function darkMode() {
        let iconoLuna=document.getElementById("iconoLuna");
        let iconoSol=document.getElementById("iconoSol");
        const overlay=document.querySelector(".overlay");
        iconoSol.style.opacity="0";
        iconoLuna.onclick=function () {
            iconoSol.style.opacity="1";
            document.body.classList.toggle("darkMode");
            iconoLuna.style.display="none";
            iconoSol.style.display="block";
        }
        iconoSol.onclick=function () {
            document.body.classList.toggle("darkMode");
            iconoLuna.style.display="block";
            iconoSol.style.display="none";
        }
    }
   
    


    






async function getProducts() {
    try {
        const URL= "https://ecommercebackend.fundamentos-29.repl.co/";
        const data= await fetch(URL);
        const res=await data.json();
        return res;
        } 
    catch (error) {
        console.log(res);
        }
}



function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}



function drawProducts(db) {
    let html=""; 
    for (const product of db.products) {
        const iconoCanti= product.quantity
                          ? `<i class='bx bx-plus' id="${product.id}"></i>`
                          : "<i class='bx bxs-balloon'></i>" 
                          "<h4>No hay más unidades del producto</h4>";
        html+= `<div class="card ${product.category}">
                    <div class="imageCard">
                        <img src="${product.image}"></img>
                        <div class="iconoMas">
                            ${iconoCanti}
                        </div>
                    </div>
                    <div class="cajaFinal">
                        <div class="precioYStock">
                            <h3>$${product.price}.00</h3>
                            <span class="stock">Stock: ${product.quantity}</span>
                        </div>
                        <div class="descripcion">
                        <p class="nombre" id="${product.name}">${product.name}</p>
                        </div>
                    </div>
                </div>` 
    }
    //El API tiene id,name,price,image,category,quantity,description
    const plasmacion=document.querySelector(".cuadriculaProductos");
    plasmacion.innerHTML=html;
    return plasmacion; 
}





    



function handleCart() {
    const cart=document.querySelector(".cart");
    const bolsa=document.querySelector(".iconoBolso");
    
    bolsa.addEventListener("click", () => {
        cart.classList.toggle("cart--show");
    });
}



function animacionScroll() {
    window.onscroll = () => 
    {
        const navBar=document.querySelector("header");
        if(document.documentElement.scrollTop > 50) navBar.classList.add("header-nav");
        else navBar.classList.remove("header-nav");
        const productos=document.querySelector("#productosenlace");
    }
}



function handleAddCart(db) {
    document.querySelector(".cuadriculaProductos").addEventListener("click", (e) => {
        if ((e.target.classList.contains("iconoMas")) || (e.target.classList.contains("bx-plus"))) {
           const id=Number(e.target.id);
           let productFound=db.products.find(product => product.id === id);
           if(db.cart[id])
           {
                if (db.cart[id].amount === db.cart[id].quantity) 
                return alert("No hay más en stock");
                db.cart[id].amount += 1;
           }
           else
           {
                db.cart[id]={
                    ...productFound,
                    amount: 1,
                };
           }
           setLocalStorage("cart", db.cart);
           drawProductsInCart(db);
           drawTotal(db);
        }
        else
        {

        }
    });
}



function drawProductsInCart(db) {
    let html="";
    for (const productCart of Object.values(db.cart)) {
     html += `
              <div class="cart_product">
                 <div class="cart_image">
                     <img src="${productCart.image}" alt="Imagen producto de carrito"></img>
                 </div>
                 <div class="cart_info">
                     <h4>${productCart.name}</h4>
                     <div class="cartPrecioYStock">
                         <p>Stock: ${productCart.quantity} |</p>
                         <p>$${productCart.price}.00</p>
                     </div>
                     <p>Subtotal: $${productCart.price * productCart.amount}.00</p>
                     <div class="cart_info_options">
                         <div class="cart_options" id="${productCart.id}">
                             <i class='bx bx-minus'></i>
                             <span>${productCart.amount} units</span>
                             <i class='bx bx-plus'></i>
                         </div>
                         <div class="cart_trash" id="${productCart.id}">
                         <i class='bx bx-trash-alt'></i>
                         </div> 
                     </div> 
                 </div>
              </div>
             `
    }
    document.querySelector(".cart_products").innerHTML=html;
}
    
    
    
function handleOptionsCart(db) {
    document.querySelector(".cart_products").addEventListener("click", (e) => {
        if (e.target.classList.contains("bx-minus")) {
           const id=Number(e.target.parentElement.id);
           if (db.cart[id].amount === 1) {
            const response=confirm("¿Seguro que desea eliminar este producto?");
            if (!response) return; 
            delete db.cart[id];
           } else {
            db.cart[id].amount-=1;
           }
        }
        if (e.target.classList.contains("bx-plus")) {
            const id=Number(e.target.parentElement.id);
            if (db.cart[id].amount === db.cart[id].quantity) return alert("No hay más en stock");
            db.cart[id].amount+=1;
        }
        if (e.target.classList.contains("bx-trash-alt")) {
            const id=Number(e.target.parentElement.id);
            const response=confirm("¿Seguro que desea eliminar este producto?");
            if (!response) return; 
            delete db.cart[id];
        }
        setLocalStorage("cart", db.cart) 
        drawProductsInCart(db);
        drawTotal(db);
    })
}    
    
    
    
function drawTotal(db) {
    const totalItems=document.querySelector("#totalItems");
    const totalMoney=document.querySelector("#totalMoney");
    let items=0;
    let money=0;
    for (const {amount, price} of Object.values(db.cart)) {
     items+=amount;
     money+=amount*price;
    }
    totalItems.textContent=`${items} items`;
    totalItems1.textContent=`${items}`;
    totalMoney.textContent=`$${money}.00`;
}
 


function cierreCart() {
    const cart=document.querySelector(".cart");
    const iconoCierre=document.querySelector(".iconoCierre");
    iconoCierre.addEventListener("click", () => {
        cart.classList.remove("cart--show");
    });
}






function handleBuy(db) {
    document.querySelector(".btn_buy").addEventListener("click", () => {
        if (Object.values(db.cart).length===0) return alert("Primero compre algo");
        const response=confirm("¿Seguro de que desea comprar?")
        if (!response) return;
        let newProducts=[];
        for (const product of db.products) {
            if(db.cart[product.id]) 
            {
                newProducts.push({
                    ...product,
                    quantity: product.quantity - db.cart[product.id].amount,
                });
            }  
            else
            {
                newProducts.push(product);
            }        
        }
        db.products=newProducts;
        db.cart={};
        setLocalStorage("products",  db.products);
        setLocalStorage("cart",  db.cart);
        drawProductsInCart(db);
        drawProducts(db);
        drawTotal(db)
    })
}


   
function handleCierreCart() {
    const cart=document.querySelector(".cart");
    const iconoCierre=document.querySelector(".iconoCierre");
    iconoCierre.addEventListener("click", () => {
        cart.classList.remove("cart--show");
    });
}
    
    
    

function mixitupConfig(){
    mixitup(".cuadriculaProductos", {
        selectors: {
            target: '.card'
        },
        animation: {
            duration: 300
        }
    });
}

    
function clicadoMenu() {
    let home=document.getElementById("Home");
    let products=document.getElementById("productosenlace");

        home.onclick=function () {
            home.style.color="var(--colorAcademlo)";
            products.style.color="var(--colorTitulo)";
        }
        products.onclick=function () {
            home.style.color="var(--colorTitulo)";
            products.style.color="var(--colorAcademlo)";
        }
} 




// function handleModal(db) {
//     document.querySelector(".cuadriculaProductos").addEventListener("click", (e) => {
//         if (e.target.classList.contains("nombre")) {
//                 const nombre=e.target.id;
//                 let productFound=db.products.find(product => product.name === nombre);
//                 drawModal(productFound);
//                 }  
//         })
//     }

//     function drawModal(productFound) {
//         const modal=document.querySelector(".modal");
//         let html="";
//         html=`<div class="cierreModal"><i class='bx bx-x iconCierreModal'></i></div>
//               <div class="contenidoModal">
//                     <div class="imageModal">
//                         <img src="${productFound.image}"></img>
//                     </div>
//                     <div class="infoModal">
//                         <h3 class="tituloModal">${productFound.name}</h3>        
//                         <p class="pModal">${productFound.description}</p>
//                     </div>
//                     <div class="cajaFinalModal">
//                         <div class="precioYStock">
//                             <h3>$${productFound.price}.00</h3>
//                             <div class="contenedoriconoModal">
//                                <i class='bx bx-plus' id="iconoModal"></i>
//                             </div>
//                         </div>
//                         <div class="remanente">
//                             <span class="stock">Stock: ${productFound.quantity}</span>
//                         </div>
//                     </div>
//               </div>`;
//         modal.innerHTML=html;
//     }



//     function cierreModal() {
//         const modal=document.querySelector(".modal");
//         const iconCierreModal=document.querySelector(".iconCierreModal");
//         const contenedorCierreModal=document.querySelector(".cierreModal");
        
//         contenedorCierreModal.addEventListener("click", () => {
//             modal.classList.add("modal--hidden");
//         });
//     }
// El modal no me funcionó por alguna razón pero seguiré intentándolo


async function main() {
    const db= 
    {
        products: JSON.parse(localStorage.getItem("products")) || (await getProducts()),
        cart: JSON.parse(localStorage.getItem("cart")) || {},
    }
    getProducts();
    drawProducts(db);
    handleCart();
    animacionScroll();
    handleAddCart(db);  
    drawProductsInCart(db);
    handleOptionsCart(db);
    drawTotal(db);
    cierreCart();
    darkMode();
    handleBuy(db);
    handleCierreCart();
    mixitupConfig();  
    clicadoMenu();
    handleModal(db);
    cierreModal();
}

window.addEventListener("load", main)