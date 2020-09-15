var puppeteer = require("puppeteer"); // importar
var express = require('express')
var app = express();

app.listen(3001,()=> {
    console.log("server running on port 3001")
    process.setMaxListeners(0);
})

app.get('/buscar', async (req,res)=>{
    let keyword = req.query.s
    console.log('Cargando datos...')
    let data = await scrap(keyword); 
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    console.log('Listo')
    res.send(data)
})
/*SCRAPER*/

async function scrap(search) {
 
 let data = [];
 let data_serco = await scrapSercoplus(search).catch(err => {return []})
 let data_cyc = await scrapCyc(search).catch(err => {return []})
 let data_impacto = await scrapImpacto(search).catch(err => {return []})
 let data_memory = await scrapMemoryKings(search).catch(err => {return []})
 let data_vipasa = await   scrapVipasa(search).catch(err => {return []})
 data = [... data_serco, ...data_cyc,...data_impacto,... data_memory, ...data_vipasa]

 console.log(data.length)
 console.log(data)
 return data;
}
function mejorPrecio(data){
 let x = data[0].precio
 let el;
 for(let i = 0; i<data.length; i++){
   if(x > data[i].precio){
     x = data[i].precio;
     el = data[i]
   }
 }
 return el;
}
async function scrapSercoplus(buscar) {
 const browser = await puppeteer.launch(); // empezare el navegador
 const page = await browser.newPage(); // nueva pagina

 await page.setRequestInterception(true);
 page.on("request", (req) => {
   if (
     req.resourceType() == "stylesheet" ||
     req.resourceType() == "font" ||
     req.resourceType() == "image" ||
     req.resourceType() == "script"
   ) {
     req.abort();
   } else {
     req.continue();
   }
 });

 await page.goto(
   `https://www.sercoplus.com/modulo/spsearchpro/catesearch?fc=module&module=spsearchpro&controller=catesearch&orderby=name&orderway=desc&cat_id=2%2C502%2C601%2C638%2C648%2C652%2C307%2C309%2C143%2C74%2C269%2C321%2C452%2C285%2C630%2C172%2C51%2C112%2C107%2C550%2C591%2C602%2C377%2C343%2C345%2C115%2C103%2C123%2C188%2C110%2C105%2C108%2C106%2C311%2C337%2C448%2C356%2C506%2C637%2C53%2C54%2C273%2C66%2C70%2C519%2C392%2C566%2C570%2C187%2C67%2C229%2C80%2C234%2C235%2C317%2C77%2C203%2C339%2C357%2C558%2C626%2C385%2C391%2C241%2C205%2C244%2C209%2C204%2C208%2C206%2C207%2C225%2C463%2C496%2C89%2C226%2C258%2C265%2C662%2C315%2C395%2C65%2C236%2C255%2C237%2C238%2C239%2C34%2C39%2C447%2C275%2C552%2C646%2C40%2C449%2C156%2C368%2C55%2C86%2C257%2C568%2C87%2C179%2C500%2C501%2C365%2C284%2C233%2C182%2C177%2C353%2C304%2C364%2C562%2C595%2C193%2C194%2C195%2C8%2C296%2C297%2C508%2C535%2C298%2C299%2C326%2C41%2C3%2C280%2C277%2C278%2C279%2C325%2C429%2C468%2C579%2C78%2C252%2C251%2C323%2C650%2C253%2C358%2C37%2C52%2C361%2C446%2C551%2C645%2C36%2C546%2C189%2C499%2C593%2C478%2C270%2C228%2C145%2C146%2C151%2C147%2C163%2C148%2C149%2C164%2C419%2C201%2C200%2C120%2C276%2C272%2C518%2C491%2C28%2C173%2C180%2C32%2C132%2C133%2C470%2C471%2C545%2C94%2C141%2C301%2C254%2C124%2C192%2C169%2C168%2C142%2C243%2C567%2C170%2C171%2C288%2C330%2C256%2C318%2C331%2C245%2C246%2C248%2C334%2C333%2C227%2C260%2C190%2C264%2C266%2C374%2C530%2C531%2C539%2C158%2C532%2C4%2C153%2C220%2C348%2C362%2C422%2C458%2C292%2C135%2C509%2C510%2C513%2C631&search_query=${buscar}&spr_submit_search=Buscar&n=12`
 ); // ir a url

 let data = await page.evaluate(() => {

   const formatear = (str) => {
       let f = str
         .replace(/\r?\n|\r/g, "")
         .replace(/(S\/.)|(S\/)/g, "")
         .trim()
         .replace(",", ".");
       if (f.split(".").length >= 3) {
         let i = f.indexOf(".");
         f = f.substring(0, i) + "" + f.substring(i + 1);
       }

       return Number(f);
     };


   let data = [];
   let elementPrecio = document.getElementsByClassName("price-soles");
   let elementNombre = document.querySelectorAll(".product-name > a");

   try {
     let c = 0;
     while (c < elementPrecio.length) {
       let producto = {
         nombre: elementNombre[c].textContent.replace(/\r?\n|\r/g, ""),
         precio: formatear(
           elementPrecio[c].textContent
             
         ),
         url: elementNombre[c].href,
         tienda:'Sercoplus'
       };
       data.push(producto);
       c++;
     }
     return data;
   } catch (err) {
     return [];
   }
 });

 return data;

}
async function scrapCyc(buscar) {
 let keyword = buscar;
 const browser = await puppeteer.launch(); // empezare el navegador
 const page = await browser.newPage(); // nueva pagina

 await page.setRequestInterception(true);
 page.on("request", (req) => {
   if (
     req.resourceType() == "stylesheet" ||
     req.resourceType() == "font" ||
     req.resourceType() == "image" ||
     req.resourceType() == "script"
   ) {
     req.abort();
   } else {
     req.continue();
   }
 });

 await page.goto(
   `https://www.cyccomputer.pe/buscar?controller=search&orderby=position&orderway=desc&search_query_cat=0&search_query=${buscar.replace(
     /(\s+)/g,
     "+"
   )}&submit_search=`
 ); // ir a url

 let data = await page.evaluate((keyword) => {

   const formatear = (str) => {
       let f = str
         .replace(/\r?\n|\r/g, "")
         .replace(/(S\/.)|(S\/)/g, "")
         .trim()
         .replace(",", ".");
       if (f.split(".").length >= 3) {
         let i = f.indexOf(".");
         f = f.substring(0, i) + "" + f.substring(i + 1);
       }

       return Number(f);
     };


   let data = [];
   let elementNombre = document.querySelectorAll(".product-name > a");
   let elementPrecio = document.getElementsByClassName("product-price");

     let c = 0;
     while (c < elementPrecio.length) {
       if (elementNombre[c].textContent.includes(keyword.toUpperCase())) {
         let producto = {
           nombre: elementNombre[c].textContent,
           precio: formatear(
             elementPrecio[c].textContent
               .split("-")[1]
               
           ),
           url: elementNombre[c].href,
           tienda:'CyC'
         };
         data.push(producto);
       }
       c++;
     }
     return data;

 }, keyword).catch((err)=>{return []});

 return data
}
async function scrapImpacto(buscar) {
 const browser = await puppeteer.launch({ headless: true }); // empezare el navegador
 const page = await browser.newPage();

 await page.setRequestInterception(true);
 page.on("request", (req) => {
   if (
     req.resourceType() == "stylesheet" ||
     req.resourceType() == "font" ||
     req.resourceType() == "image" ||
     req.resourceType() == "script"
   ) {
     req.abort();
   } else {
     req.continue();
   }
 });

 await page.goto(`https://impacto.com.pe/web/`); // ir a url
 await page.type("#txtbusfiltro", buscar);

 await page.evaluate(() => {
   document.querySelector(".h1h2c > form").submit();
 });

 await page.waitForNavigation();

 let data = await page.evaluate(() => {

   const formatear = (str) => {
       let f = str
         .replace(/\r?\n|\r/g, "")
         .replace(/(S\/.)|(S\/)/g, "")
         .trim()
         .replace(",", ".");
       if (f.split(".").length >= 3) {
         let i = f.indexOf(".");
         f = f.substring(0, i) + "" + f.substring(i + 1);
       }

       return Number(f);
     };

   
   let data = [];
   let elementNombre = document.querySelectorAll("div.titulo");
   let elementPrecio = document.querySelectorAll("div.precio");
   let url = document.querySelectorAll("li > .cajaprod_a");

     let c = 0;
     let i = 1;
     while (c < elementNombre.length) {
       let producto = {
         nombre: elementNombre[c].innerHTML,
         precio: 
           formatear(elementPrecio[i].innerHTML)
         ,
         url: url[c].href,
         tienda:'Impacto'
       };
       data.push(producto);
       c++;
       i += 2;
     }

     return data;
  
 }).catch((err)=>{return []});
 return data;
}
async function scrapMemoryKings(buscar) {
 let keyword = buscar;
 const browser = await puppeteer.launch(); // empezare el navegador
 const page = await browser.newPage(); // nueva pagina

 await page.setRequestInterception(true);
 page.on("request", (req) => {
   if (
     req.resourceType() == "stylesheet" ||
     req.resourceType() == "font" ||
     req.resourceType() == "image" ||
     req.resourceType() == "script"
   ) {
     req.abort();
   } else {
     req.continue();
   }
 });

 await page.goto(
   `https://www.memorykings.com.pe/resultados/${buscar.replace(
     /(\s+)/g,
     "%20"
   )}`
 );

 let data = await page.evaluate((keyword) => {

   const formatear = (str) => {
       let f = str
         .replace(/\r?\n|\r/g, "")
         .replace(/(S\/.)|(S\/)/g, "")
         .trim()
         .replace(",", ".");
       if (f.split(".").length >= 3) {
         let i = f.indexOf(".");
         f = f.substring(0, i) + "" + f.substring(i + 1);
       }

       return Number(f);
     };

   let data = [];
   let elementNombre = document.querySelectorAll(".alto_65");

   let elementPrecio = document.getElementsByClassName("amount");
   let url = document.querySelectorAll(".product-thumb-info-content > a");

   let c = 0;

     while (c < elementPrecio.length) {
       if (elementNombre[c].textContent.includes(keyword.toUpperCase())) {
         let producto = {
           nombre: elementNombre[c].textContent,
           precio: 
             formatear(elementPrecio[c].textContent.split('ó')[1])
           
           ,
           url: url[c].href,
           tienda:'MemoryKings'
         };
         data.push(producto);
       }
       c++;
     }

     return data;

   
 }, keyword).catch((err)=> {return []});

 return data;
}

async function scrapVipasa(buscar) {



 let keyword = buscar;
 const browser = await puppeteer.launch(); // empezare el navegador
 const page = await browser.newPage(); // nueva pagina

 await page.setRequestInterception(true);
 page.on("request", (req) => {
   if (
     req.resourceType() == "stylesheet" ||
     req.resourceType() == "font" ||
     req.resourceType() == "image" ||
     req.resourceType() == "script"
   ) {
     req.abort();
   } else {
     req.continue();
   }
 });

 await page.goto(
   `https://www.vipasa.pe/buscar?controller=search&orderby=position&orderway=desc&search_query=${buscar.replace(
     /(\s+)/g,
     "+"
   )}`
 ); // ir a url

 let data = await page.evaluate((keyword) => {

   const formatear = (str) => {
       let f = str
         .replace(/\r?\n|\r/g, "")
         .replace(/(S\/.)|(S\/)/g, "")
         .trim()
         .replace(",", ".");
       if (f.split(".").length >= 3) {
         let i = f.indexOf(".");
         f = f.substring(0, i) + "" + f.substring(i + 1);
       }

       return Number(f);
     };

     let data = [];
     let elementNombre = document.querySelectorAll(".product-name");
     let elementPrecio = document.querySelectorAll(".price_container >.product-price");

     let c = 0;
     while (c < elementPrecio.length) {
       if (
         elementNombre[c+1].textContent
           .replace(/\s+/g, "")
           .toUpperCase()
           .includes(keyword.replace(/\s+/g, "").toUpperCase())
       ) {
         let producto = {
           nombre: elementNombre[c+1].textContent,
           precio: formatear(
             elementPrecio[c].textContent
           )
             ,
           url: elementNombre[c+1].href,
           tienda:'Vipasa'
         };
         data.push(producto);
       }
       c++;
     }
     return data;
  
 }, keyword).catch((err)=>{return []});

 return data
}




/*async function scrapLinio(buscar) {
 let keyword = buscar;
 const browser = await puppeteer.launch(); // empezare el navegador
 const page = await browser.newPage(); // nueva pagina

 await page.setRequestInterception(true);
 page.on("request", (req) => {
   if (
     req.resourceType() == "stylesheet" ||
     req.resourceType() == "font" ||
     req.resourceType() == "image" ||
     req.resourceType() == "script"
   ) {
     req.abort();
   } else {
     req.continue();
   }
 });

 await page.goto(
   `https://www.linio.com.pe/search?scroll=&q=${buscar.replace(/(\s+)/g, "+")}`
 ); // ir a url

 let data = await page.evaluate(
   (keyword) => {

     const formatear = (str) => {
       let f = str
         .replace(/\r?\n|\r/g, "")
         .replace(/(S\/.)|(S\/)/g, "")
         .trim()
         .replace(",", ".");
       if (f.split(".").length >= 3) {
         let i = f.indexOf(".");
         f = f.substring(0, i) + "" + f.substring(i + 1);
       }
     
       return Number(f);
     };
     
     let data = [];
     let elementNombre = document.querySelectorAll(".title-section");
     let elementPrecio = document.getElementsByClassName("price-main-md");
     let url = document.querySelectorAll(
       ".switchable-product-container > div > a"
     );

     let c = 0;
     while (c < elementPrecio.length) {
       if (
         elementNombre[c].textContent
           .replace(/\s+/g, "")
           .toUpperCase()
           .includes(keyword.replace(/\s+/g, "").toUpperCase())
       ) {
         let producto = {
           nombre: elementNombre[c].textContent,
           precio: formatear(elementPrecio[c].innerHTML),
           url: url[c].href,
         };  
         data.push(producto);
       }
       c++;
     }
     return data;
   },
   keyword
   
 )

 return data;
}*/


