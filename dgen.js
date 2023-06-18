const dgen = {};
let dialogName = "my";

dgen.getCode = (content) => {
  let output = '';
  let dialogTitle = '';
  const allFields = [];

  // break up by rows
  const rows = getRows(content);

  // dialog title and id
  dialogTitle = getColumns(rows.shift())[0];
  dialogName = toCamelCase(dialogTitle);

  // initialize the dialog
  output = `<div class="modal" tabindex="-1" role="dialog" id="${dialogName}Modal" data-backdrop="static"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">${dialogTitle}</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div><div class="modal-body">`;

  // render rows
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    output += (i < rows.length - 1) ? `<div class="row">` : `</div>`;
    // extract columns
    let columns = getColumns(row);
    for (let column of columns) {
      output += (i < rows.length - 1) ? `<div class="col">` : `<div class="modal-footer">`;
      // render fields
      let fields = getFields(column);
      for (let field of fields) {
        allFields.push(field);
        column = column.replace(`[${field}]`, renderField(field));
      }
      output += `${column}`;
      output += `</div>`;
    }
    output += (i < rows.length - 1) ? `</div>` : ``;
  }
  // finish off the html
  output += `</div></div></div>\n`;

  // now generate the dialog object
  output += `<script>\n${renderCode(dialogName, allFields)}\n</script>`;

  return output;
};

function toCamelCase(str) {
  const words = str.replace(/[^a-zA-Z0-9]+/g, ' ').split(' ');
  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });
  return camelCaseWords.join('');
}

// Function to get rows from DGen notation
function getRows(dgen) {
  let cleanDgen = dgen.replace(/[\n\r]/g, ''); // Remove newlines
  let matches = cleanDgen.match(/<\s*([^>]+)\s*>/g);
  return matches ? matches.map(match => match.slice(1, -1).trim()) : [];
}

// Function to get columns from a row in DGen notation
function getColumns(row) {
  let matches = row.match(/{\s*([^}]+)\s*}/g);
  return matches ? matches.map(match => match.slice(1, -1).trim()) : [];
}

// Function to get fields from a column in DGen notation
function getFields(column) {
  let matches = column.match(/\[\s*([^\]]+)\s*\]/g);
  return matches ? matches.map(match => match.slice(1, -1).trim()) : [];
}

// Function to render a field based on its type
function renderField(field) {
  let parts = field.split(':');
  let fieldType = parts[0];
  let params = parts[1].split(',');

  switch (fieldType) {
    case 'T': // Text input
      return `<input type="text" id="${dialogName}Dialog_${params[0]}" class="form-control" maxlength="${params[1]}" onchange="${dialogName}Dialog.${params[0]}OnChange(this)">`;

    case 'N': // Integer input
      return `<input type="number" id="${dialogName}Dialog_${params[0]}" class="form-control" min="${params[1]}" max="${params[2]}" onchange="${dialogName}Dialog.${params[0]}OnChange(this)">`;

    case 'F': // Float input
      return `<input type="number" id="${dialogName}Dialog_${params[0]}" class="form-control" step="0.01" min="${params[1]}" max="${params[2]}" onchange="${dialogName}Dialog.${params[0]}OnChange(this)">`;

    case 'P': // Password input
      return `<input type="password" id="${dialogName}Dialog_${params[0]}" class="form-control" maxlength="${params[1]}">`;

    case 'A': // Textarea
      return `<textarea id="${dialogName}Dialog_${params[0]}" class="form-control" rows="${params[1]}" onchange="${dialogName}Dialog.${params[0]}OnChange(this)"></textarea>`;

    case 'B': // Button
      return `<button id="${dialogName}Dialog_${params[0]}" class="btn btn-primary" onclick="${dialogName}Dialog.${params[0]}OnClick(this)">${params[1]}</button>`;

    case 'X': // Checkbox
      return `<input type="checkbox" id="${dialogName}Dialog_${params[0]}" value="${params[0]}" class="form-check-input" onchange="${dialogName}Dialog.${params[0]}OnChange(this)">`;

    case 'R': // Radio button
      return `<input type="radio" id="${dialogName}Dialog_${params[0]}" name="${dialogName}Dialog_${params[1]}" value="${params[2]}" class="form-check-input" onchange="${dialogName}Dialog.${params[0]}OnChange(this)">`;

    case 'D': // Dropdown list
      return `<select id="${dialogName}Dialog_${params[0]}" class="form-select" onchange="${dialogName}Dialog.${params[0]}OnChange(this)"><option>--Choose--</option></select>`;

    default:
      return '';
  }
}

function renderCode(dialogName, fields) {
  let code = `const ${dialogName}Dialog = {
    id: "${dialogName}Modal",`;

  // field declarations
  for (let field of fields) {
    let parts = field.split(':');
    let type = parts[0], params = parts[1].split(',');
    if (type != 'B') {
      code += `${params[0]}:"",`;
    }
  }

  // show/hide functions
  code += `\n  show: function() {\n`;
  for (let field of fields) {
    let parts = field.split(':');
    let type = parts[0], params = parts[1].split(','), id = params[0];
    switch (type) {
      case 'X':
        code += `    document.getElementById('${dialogName}Dialog_${id}').checked = this.${id};\n`;
        break;
      case 'R':
        code += `    document.getElementsByName('${dialogName}Dialog_${params[1]}').forEach((el) => { el.checked = el.value === this.${id}; });\n`;
        break;
      case 'B':
        break;
      default:
        code += `    document.getElementById('${dialogName}Dialog_${id}').value = this.${id};\n`;
        break;
    }
  }
  code += `    $('#' + this.id).modal('show');\n  },\n`;

  code += `  hide: function() {\n`;
  for (let field of fields) {
    let parts = field.split(':');
    let type = parts[0], params = parts[1].split(','), id = params[0];
    switch (type) {
      case 'X':
        code += `    this.${id} = document.getElementById('${dialogName}Dialog_${id}').checked;\n`;
        break;
      case 'R':
        code += `    this.${id} = document.querySelector('input[name="${dialogName}Dialog_${params[1]}"]:checked').value;\n`;
        break;
      case 'B':
        break;
      default:
        code += `    this.${id} = document.getElementById('${dialogName}Dialog_${id}').value;\n`;
        break;
    }
  }
  code += `    $('#' + this.id).modal('hide');\n  },\n`;

  //   // Event Handler Functions
  for (let field of fields) {
    let parts = field.split(':');
    let type = parts[0], params = parts[1].split(','), id = params[0];
    let suffix = (type == 'B') ? 'OnClick' : 'OnChange';
    code += `  ${id}${suffix}: function (event) {\n  },\n`;
  }

  code += `};`;

  return code;
}

exports.dgen = dgen;