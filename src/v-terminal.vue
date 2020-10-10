<template>
  <div @click="$refs.cmd.focus()">
    <div ref="terminal" id="container">
      <div v-if="banner" id="banner">
        <h2 v-if="banner.header" style="letter-spacing: 4px">
          {{ banner.header }}
        </h2>
        <p v-if="banner.subHeader">{{ banner.subHeader }}</p>
        <p v-if="banner.helpHeader">{{ banner.helpHeader }}</p>
        <p></p>
      </div>
      <output ref="output"></output>
      <div id="input-line" class="input-line">
        <div class="prompt">{{ banner.sign ? banner.sign : ">>" }}</div>
        <input
          v-model="value"
          ref="cmd"
          @keydown.enter="cmd_enter($event)"
          @keydown.up="history_up()"
          @keydown.down="history_down()"
          @keydown.tab="cmd_tab($event)"
          class="cmdline"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shell_input: {
      required: false
    },
    banner: {
      type: Object,
      required: false,
      default: () => {
        return {
          header: "Vue Terminal",
          subHeader: "Welcome to Vue Terminal",
          helpHeader: 'Enter "help" for more information.',
          sign: "Vue-terminal $"
        };
      }
    },
    commands: {
      type: Array
    }
  },
  data() {
    return {
      value: "",
      history_: [],
      histpos_: 0,
      histtemp_: 0
    };
  },
  computed: {
    allcommands() {
      var tab = [
        { name: "help", desc: "Show all the commands that are available" },
        { name: "clear", desc: "Clear the terminal of all output" }
      ];

      if (this.commands) {
        this.commands.forEach(({ name, desc }) => {
          tab.push({ name, desc });
        });
      }

      return tab;
    }
  },
  watch: {
    shell_input(val) {
      this.output(val);
      this.$parent.send_to_terminal = "";
    }
  },
  // TODO 暴露一个随时停止输入的接口
  methods: {
    history_up() {
      if (this.history_.length) {
        if (this.history_[this.histpos_]) {
          this.history_[this.histpos_] = this.value;
        } else {
          this.histtemp_ = this.value;
        }
      }
      // up 38
      this.histpos_--;
      if (this.histpos_ < 0) {
        this.histpos_ = 0;
      }
      this.value = this.history_[this.histpos_]
        ? this.history_[this.histpos_]
        : this.histtemp_;
    },
    history_down() {
      if (this.history_.length) {
        if (this.history_[this.histpos_]) {
          this.history_[this.histpos_] = this.value;
        } else {
          this.histtemp_ = this.value;
        }
      }
      this.histpos_++;
      if (this.histpos_ > this.history_.length) {
        this.histpos_ = this.history_.length;
      }
      this.value = this.history_[this.histpos_]
        ? this.history_[this.histpos_]
        : this.histtemp_;
    },
    cmd_tab(e) {
      e.preventDefault();
    },
    cmd_enter() {
      if (this.value) {
        this.history_[this.history_.length] = this.value;
        this.histpos_ = this.history_.length;
      }

      //   Duplicate current input and append to output section.
      var line = this.$refs.cmd.parentNode.cloneNode(true);
      line.removeAttribute("id");
      line.classList.add("line");
      var input = line.querySelector("input.cmdline");
      input.autofocus = false;
      input.readOnly = true;
      this.$refs.output.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(" ").filter(function(val) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      if (cmd == "clear") {
        this.$refs.output.innerHTML = "";
        this.value = "";
      } else if (cmd == "help") {
        var commandsList = this.allcommands.map(({ name, desc }) => {
          if (desc) {
            return `${name}: ${desc}`;
          }

          return name;
        });

        this.output(
          '<div class="ls-files">' + commandsList.join("<br>") + "</div>"
        );
      } else {
        if (this.commands) {
          this.commands.forEach(a => {
            if (cmd == a.name) {
              this.output(a.get());
              return;
            }
          });
        }
        if (this.value.trim() != "") {
          this.$emit("shell_output", this.value);
        }
        this.value = "";
      }
    },
    output(html) {
      this.$refs.output.insertAdjacentHTML(
        "beforeEnd",
        "<pre class='out' style='white-space: pre-wrap;word-wrap: break-word;'>" +
          html +
          "</pre>"
      );
      this.value = "";
    }
  }
};
</script>

<style lang="css" scoped>
#container {
  color: white;
  background-color: #181818;
  font-size: 16px;
  font-family: monospace;
  padding: 0.5em 1.5em 1em 1em;
  /* width: 100vw;
  height: 100vh; */
}
output {
  clear: both;
  width: 100%;
}
#banner {
  margin-bottom: 3em;
}
h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.input-line {
  display: flex;
  align-items: center;
  clear: both;
}

.prompt {
  white-space: nowrap;
  color: #3a8b17;
  margin-right: 7px;
  user-select: all;
}
.cmdline {
  outline: none;
  background-color: transparent;
  margin: 0;
  flex: 1;
  white-space: pre-wrap;
  word-wrap: break-word;
  font: inherit;
  border: none;
  user-select: all;
  color: inherit;
}

.ls-files {
  height: 45px;
  column-width: 100px;
}
</style>
