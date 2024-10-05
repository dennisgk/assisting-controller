import { components, deps, pages, utils } from "../../meta";

const Extension = (props: pages.edit.EditChildProps) => {
  const [search_params] = deps.router.use_search_params();
  const api = utils.react.use_context(components.ac.api.Context);
  const navigate = deps.router.use_navigate();

  const [value, set_value] = utils.react.use_state("");

  utils.react.use_effect(() => {
    api.queue(
      async () =>
        set_value(
          await (
            await fetch(
              `/api/get_extension_text?name=${search_params.get("name") ?? ""}`
            )
          ).text()
        ),
      () => navigate("/")
    );
  }, []);

  return search_params.get("name") === null ? (
    <deps.router.Navigate to="/" />
  ) : (
    <props.edit
      header={(saved) =>
        `Edit Python Extension - ${search_params.get("name")} - ${
          saved ? "Saved" : "Unsaved"
        }`
      }
      on_save={(on_success) => {
        api.queue(async () => {
          let resp = await fetch("/api/edit_extension", {
            method: "POST",
            body: JSON.stringify({
              name: search_params.get("name"),
              text: value,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (resp.ok) on_success();
          else
            api.gen_output({
              text: `Failed to save extension with code ${resp.status}`,
              bold: true,
              color: "PRIMARY",
            });
        });
      }}
      value={value}
      on_change={(text) => set_value(text)}
    />
  );
};

export { Extension };
