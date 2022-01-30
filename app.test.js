describe("skelo app", () => {
    describe("command", () => {
      it.todo("build");
      describe("toyaml", () => {
        describe("argument proceesing", () => {
          it.todo("sends error message to console when no arguments specified");
          it.todo("applies default .md extension to source argument");
          it.todo("uses source basename as target");
          describe("applies default extension to target argument", () => {
            it.todo("when target not specified");
            it.todo("when target is specified without extension");
          });
        });
        describe("action", () => {
          it.todo("builds valid single root key");
          describe("builds valid content from header and bulletlist", () => {
            it.todo("adds sidebar-level attributes");
            it.todo(
              "creates string yaml for topic items with no topic attributes"
            );
            it.todo("creates yaml object for topic items with topic attributes");
            it.todo(
              "creates yaml object for topic items with @headings attribute"
            );
          });
        });
      });
    });
  });
  