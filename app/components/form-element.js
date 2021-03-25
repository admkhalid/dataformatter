import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

class Field {
  @tracked phone;
  @tracked comprehension;
  @tracked comp_index;
  @tracked comp_range;
  @tracked transform;
  @tracked nthword;
  @tracked irand;
  @tracked irand_range;
  @tracked arand;
  @tracked aRandBefore;
  @tracked rem;
  @tracked rem_range;
  @tracked rem_str;
  @tracked repl;
  @tracked acr;

  @action togglePhone() {
    console.log("toggling phone " + this.phone);
    this.phone = !this.phone;
    console.log("to " + this.phone);
  }

  @action toggleComp() {
    console.log("called");
    this.comprehension = !this.comprehension;
  }

  @action indexrange(index, range) {
    this.comp_index = index;
    this.comp_range = range;
  }

  @action toggleTransform() {
    this.transform = !this.transform;
  }

  @action toggleNthWord() {
    this.nthword = !this.nthword;
  }

  @action toggleIRand() {
    this.irand = !this.irand;
  }

  @action toggleIRandRange() {
    console.log("toggling irand range");
    this.irand_range = !this.irand_range;
    console.log(this.irand_range);
  }

  @action toggleARand() {
    this.arand = !this.arand;
  }

  @action toggleARandBefore(b) {
    this.aRandBefore = b;
  }

  @action toggleRem() {
    this.rem = !this.rem;
  }

  @action toggleRemRangeStr(r, s) {
    this.rem_range = r;
    this.rem_str = s;
  }

  @action toggleRepl() {
    this.repl = !this.repl;
  }

  @action toggleAcr() {
    this.acr = !this.acr;
  }

  @action toggleClean() {
    this.clean = !this.clean;
  }

  constructor() {
    this.phone = false;
    this.comprehension = false;
    this.comp_index = false;
    this.comp_range = false;
    this.transform = false;
    this.nthword = false;
    this.irand = false;
    this.irand_range = false;
    this.arand = false;
    this.aRandBefore = false;
    this.rem = false;
    this.acr = false;
    this.clean = false;
  }
}

export default class FormElementComponent extends Component {
  @tracked it;
  @tracked morefields;
  @tracked custom;
  @tracked fields;
  // @tracked lower;
  // @tracked upper;
  @tracked result;
  //strinng comprehension
  @action toggleComp(i) {
    this.fields[i].comprehension = !this.fields[i].comprehension;
  }

  @action indexrange(index, range) {
    this.comp_index = index;
    this.comp_range = range;
  }

  @action toggleTransform() {
    this.transform = !this.transform;
  }

  @action toggleNthWord(i) {
    console.log("toggle n called" + i);
    this.fields[i].toggleNthWord();
  }

  @action toggleCustom(b) {
    console.log(b);
    this.custom = b;
  }

  @action addField() {
    this.it = this.it.concat([this.it.length + 1]);
    console.log(this.it);
    if (!this.morefields) {
      this.morefields = true;
    }
    this.fields = this.fields.concat([new Field()]);
  }

  @action removefield() {
    this.it = this.it.slice(0, this.it.length - 1);
    if (this.it.length == 1) {
      this.morefields = false;
    }
    this.fields = this.fields.slice(0, this.fields.length - 1);
  }

  @action submit(e) {
    e.preventDefault();
    console.log("submit is called");
    let f = [],
      format = "";
    for (var i = 0; i < this.fields.length; ++i) {
      console.log(i.toString());
      f.push(document.getElementById("" + i).value);
    }
    if (this.custom) {
      format = document.getElementById("theform").elements.namedItem("format")
        .value;
    } else {
      for (var i = 0; i < this.fields.length; ++i) {
        format += `\$${i + 1}`;
        if (this.fields[i].phone) {
          format += "-ph{";
          let ph_form = document.getElementById("ph-form").value;
          switch (ph_form) {
            case "1":
              format += "$1-$2-$3";
              break;
            case "2":
              format += "$1.$2.$3";
              break;
            case "3":
              format += "($1) $2-$3";
              break;
          }
          format += "}";
        } else {
          // console.log(this.fields.comprehension)
          if (this.fields[i].comprehension) {
            format += "-i[";
            console.log(format);
            if (this.fields[i].comp_index) {
              format += document
                .getElementById("theform")
                .elements.namedItem("index" + i).value;
            } else if (this.fields[i].comp_range) {
              let from = document
                  .getElementById("theform")
                  .elements.namedItem("from" + i).value,
                to = document
                  .getElementById("theform")
                  .elements.namedItem("to" + i).value;
              if (from != "" || from != null) {
                format += from;
              }
              format += ":";
              if (to != "" || to != null) {
                format += to;
              }
            }
            format += "]";
            console.log(format);
          }
          if (this.fields[i].transform) {
            if (
              document
                .getElementById("theform")
                .elements.namedItem("transformopt" + i).value == "lower"
            ) {
              format += "-l";
            } else {
              format += "-u";
            }
            // format += `-w[${document.getElementById('nthword-index'+i).value}]`;
            console.log(format);
          }

          if (this.fields[i].irand) {
            format += "-irand{";
            if (this.fields[i].irand_range) {
              format += "range";
              format +=
                document
                  .getElementById("theform")
                  .elements.namedItem("irand_from" + i).value + ":";
              format +=
                document
                  .getElementById("theform")
                  .elements.namedItem("irand_to" + i).value + ",";
            }
            format +=
              "count=" +
              document
                .getElementById("theform")
                .elements.namedItem("irand_count" + i).value;
            format += "}";
          }

          if (this.fields[i].nthword) {
            format += `-w[${
              document.getElementById("nthword-index" + i).value
            }]`;
            console.log(format);
          }

          if (this.fields[i].arand) {
            // console.log(document.getElementById("arandpos" + i).value);
            console.log(document.getElementById("rand-class" + i).value);
            console.log(document.getElementById("arand_count" + i).value);
            format += `-arand\{${
              document.getElementById('theform').elements.namedItem("arandpos" + i).value
            },from=${document.getElementById("rand-class" + i).value}\,count=${
              document.getElementById("arand_count" + i).value
            }\}`;
            // format += '-arand{';
            // if (document.getElementById('theform').elements.namedItem("arandpos" + i).value == 'b') {
            //     format += 'b,';
            // } else {
            //     format += 'a,';
            // }
            // switch (document.getElementById('rand-class').value) {
            //     case 1:
            //         format += 'from=num,';
            //         break;
            //     case 2:
            //         format += `from=alpha,`;
            //         break;
            //     case 3:
            //             format += `from=vow`;
            //             break;
            //     case 4:
            //         format += `from=cons`;
            //         break;
            //     default:
            //         break;
            // }
            // format += "count=" + document.getElementById("theform").elements.namedItem("arand_count" + i).value;
            // format += '}';
          }
          if (this.fields[i].rem) {
            format += "-rem{";
            if (this.fields[i].rem_range) {
              format +=
                "range=[" +
                document.getElementById("rem_from" + i).value +
                ":" +
                document.getElementById("rem_to" + i).value +
                "],";
            } else if (this.fields[i].rem_str) {
              // format += 'range[' + document.getElementById('rem_from' + i).value + ':' + document.getElementById('rem_from' + i).value + ']';
              format += `specstr="${
                document.getElementById("rem_str").value
              }",`;
            }

            if (this.fields[i].repl) {
              format += `repl=\{"${
                document.getElementById("repl_str").value
              }"\}`;
            }

            format += "}";
          }
          if (this.fields[i].acr) {
            let sep = document.getElementById("acr_sep" + i).value;
            if (sep == "") format += "-acr";
            else {
              format += `-acr\{sep=${sep}\}`;
            }
          }
          if (this.fields[i].clean) {
            format += "-clean";
          }
        }
        format += document.getElementById("separator" + i).value;
      }
    }
    console.log(JSON.stringify({ ip: f, regex: format }));
    fetch("http://localhost:8080/examples/regex", {
      method: "POST",
      body: JSON.stringify({ ip: f, regex: format }),
    })
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error("Internal Server Error Occured");
      })
      .then((data) => {
        console.log(data);
        this.result = data;
      })
      .catch((e) => {
        console.log(e);
        this.result(e);
      });
  }

  constructor(...attr) {
    super(...attr);
    this.it = [0];
    this.fields = [new Field()];
    this.morefields = false;
    this.custom = false;
  }
}
