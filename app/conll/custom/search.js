$("#search").click(function(){
  search()
})

async function searchAPI(){
  const response = await fetch("/search");
  return response.json()

}

class UI {
    static createSent(domId, content){
        var dom = `
<article class="entry-content" id="article-input-${domId}">
<div id="vis-${domId}" tabs="yes" style="display:none"></div>
<textarea id="input-${domId}" rows="10" cols="80"
style="margin-top:0; display:none"></textarea>
<!-- no need to show the intermediate data representation -->
<textarea id="parsed-${domId}" style="display:none; margin: 0"></textarea>
<!--<p>Log and validator output:</p>-->
<!--<textarea id="log-${domId}" rows="10" cols="80" style="margin-top:0"
disabled="disabled"></textarea>-->
<!-- this div just initializes the pre-built visualization above. -->
<div class="conllu-parse" tabs="yes"
 data-visid="vis-${domId}" data-inputid="input-${domId}" data-parsedid="parsed-${domId}"
 data-logid="log-${domId}">
${content}
</div>
</article>
`
        $(".entry").append(dom);
    }
}
class Sentence {
  constructor(domId, sentId, content) {
    this.domId = "#" + domId;
    this.articleDom = "#article-" + domId;
    this.sentId = sentId
    this.sentIdDom = this.articleDom + " g.sentnum text"
    this.content = content
  }

  hide(){
    $(this.articleDom).hide()
  }

  updateSentIdDom(){
    $(this.sentIdDom).html(this.sentId)
  }
  show(){
    var content = this.content.replace("sent_id =", "sentence-label")
//    console.log(content)
//    console.log(this.dom);
    console.log('this.dom', this.domId);
    $(this.domId).val(content + "\n")
    $(this.domId).trigger("keyup")
    $(this.domId).val(content)
    $(this.domId).trigger("keyup")
    setTimeout(this.updateSentIdDom.bind(this), 500)
  }
}

function search(){
  searchAPI().then(function(data){
    for(var i in data["sents"]){
        console.log(i)
        var sent = data["sents"][i]
        console.log(sent)
        domId = "input-" + (parseInt(i) + 1)
        console.log("domId", domId)
        content = sent["content"] + "\n"
        content = this.content.replace("sent_id =", "sentence-label")
        UI.createSent(sent["id"], content)
        sentence = new Sentence(domId, sent["id"], content)
        sentence.show()
    }
  })
}


search()