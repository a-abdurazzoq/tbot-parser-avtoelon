import Parser from "./libs/parser";
import AutoElonRepo from "./repositories/AutoElon";


(async () => {
    let autoElonRepo = new AutoElonRepo()
    let parser = new Parser(autoElonRepo);
    let data = await parser.getDescriptionAutomobileObject("https://avtoelon.uz/uz/a/show/2841898");
    console.log(data)
})()