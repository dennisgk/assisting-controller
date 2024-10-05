import { types, utils, components, deps } from "../../meta";

type Queue = (
  ev: () => Promise<void>,
  on_error?: types.general.Handler<any> | undefined
) => void;

type SchemaExtension = {
  name: string;
};
type SchemaProcedure = {
  name: string;
  info: Array<string>;
};
type OutputSpecifier = {
  bold?: types.layout.Bold | undefined;
  color?: types.layout.Color | undefined;
  text: string;
};

type SchemaButton = {
  text: string;
  on_click_body: string;
  confirm_nullable: string | null;
};

type State = {
  schema: {
    extensions: Array<SchemaExtension>;
    procedures: Array<SchemaProcedure>;
    running: Array<{
      name: string;
      buttons: Array<SchemaButton>;
    }>;
    admin: Array<SchemaButton>; // include both text button stuff and action button stuff
  };
  output: Array<types.react.Element>;
  gen_output: (...args: Array<OutputSpecifier>) => void;
  clear_output: () => void;
  queue: Queue;
  refresh_schema: () => void;
};

const gen_accordion_extension = (
  api: State,
  ex: SchemaExtension,
  navigate: deps.router.NavigateFunction
) => ({
  header: ex.name,
  children: [
    { type: "TEXT", text: "Type: Extension" },
    {
      type: "BUTTON",
      text: "Edit",
      on_click: () =>
        navigate({
          pathname: "/edit/extension",
          search: deps.router
            .create_search_params({
              name: ex.name,
            })
            .toString(),
        }),
    },
    {
      type: "BUTTON",
      text: "Delete",
      on_click: () => {
        api.queue(async () => {
          let resp = await fetch(`/api/delete_extension?name=${ex.name}`);

          if (resp.ok) api.refresh_schema();
          else
            api.gen_output({
              text: "Failed to delete extension",
              bold: true,
              color: "PRIMARY",
            });
        });
      },
      confirm: "Are you sure you want to delete this extension?",
    },
  ],
});

const gen_accordion_procedure = (
  api: State,
  proc: SchemaProcedure,
  navigate: deps.router.NavigateFunction
) => ({
  header: proc.name,
  children: [
    { type: "TEXT", text: "Type: Procedure" },
    ...proc.info.map((v) => ({
      type: "TEXT",
      text: v,
    })),
    {
      type: "BUTTON",
      text: "Start",
      on_click: () =>
        navigate({
          pathname: "/run",
          search: deps.router
            .create_search_params({
              name: proc.name,
            })
            .toString(),
        }),
      confirm: undefined,
    },
    {
      type: "BUTTON",
      text: "Edit",
      on_click: () =>
        navigate({
          pathname: "/edit/procedure",
          search: deps.router
            .create_search_params({
              name: proc.name,
            })
            .toString(),
        }),
      confirm: undefined,
    },
    {
      type: "BUTTON",
      text: "Delete",
      on_click: () => {
        api.queue(async () => {
          let resp = await fetch(`/api/delete_procedure?name=${proc.name}`);

          if (resp.ok) api.refresh_schema();
          else
            api.gen_output({
              text: "Failed to delete procedure",
              bold: true,
              color: "PRIMARY",
            });
        });
      },
      confirm: "Are you sure you want to delete this procedure?",
    },
  ],
});

const gen_accordion_running = (
  api: State,
  proc: SchemaProcedure,
  buttons: Array<SchemaButton>
) => ({
  header: proc.name,
  children: [
    { type: "TEXT", text: "Type: Procedure" },
    ...proc.info.map((v) => ({
      type: "TEXT",
      text: v,
    })),
    ...buttons.map((v) => ({
      type: "BUTTON",
      text: v.text,
      on_click: () => eval(v.on_click_body),
      confirm: v.confirm_nullable === null ? undefined : v.confirm_nullable,
    })),
    {
      type: "BUTTON",
      text: "Stop",
      on_click: () =>
        api.queue(async () => {
          let resp = await fetch(`/api/stop_procedure?name=${proc.name}`);

          if (!resp.ok)
            api.gen_output({
              text: "An error occurred while stopping the procedure",
              bold: true,
              color: "PRIMARY",
            });
          else
            api.gen_output({
              text: `Procedure "${proc.name}" was successfully stopped`,
            });

          api.refresh_schema();
        }),
      confirm: "Are you sure you want to stop this procedure?",
    },
  ],
});

const gen_output = (...args: Array<OutputSpecifier>): types.react.Element => (
  <components.layout.stack.Cell key={Math.floor(Math.random() * 999999999)}>
    {args.map((v) => (
      <components.layout.text.Text
        size="MEDIUM"
        color={v.color}
        bold={v.bold}
        key={Math.floor(Math.random() * 999999999)}
      >
        {v.text}
      </components.layout.text.Text>
    ))}
  </components.layout.stack.Cell>
);

const Context = utils.react.create_context<State>(undefined!);

const Provider = (props: types.react.ElemChildrenProps) => {
  const [is_loading, set_is_loading] = utils.react.use_state(false);

  const [extensions, set_extensions] = utils.react.use_state<
    State["schema"]["extensions"]
  >([]);
  const [procedures, set_procedures] = utils.react.use_state<
    State["schema"]["procedures"]
  >([]);
  const [running, set_running] = utils.react.use_state<
    State["schema"]["running"]
  >([]);
  const [admin, set_admin] = utils.react.use_state<State["schema"]["admin"]>(
    []
  );

  const [output, set_output] = utils.react.use_state<
    Array<types.react.Element>
  >([]);

  const req_data = utils.react.use_ref<
    Array<{ key: () => Promise<void>; ran: () => Promise<void> }>
  >([]);

  const queue = utils.react.use_callback<Queue>((ev, on_error) => {
    req_data.current.push({
      key: ev,
      ran: async () => {
        try {
          await ev();
        } catch (error) {
          if (on_error !== undefined) {
            on_error(error);
          }
        }
        req_data.current.keep((v) => v.key !== ev);

        if (req_data.current.length === 0) {
          set_is_loading(false);
        } else {
          req_data.current[0].ran();
        }
      },
    });

    set_is_loading(true);
    if (req_data.current.length === 1) {
      req_data.current[0].ran();
    }
  }, []);

  const refresh_schema = utils.react.use_callback(() => {
    queue(async () =>
      set_extensions((await (await fetch("/api/get_extensions")).json()) as any)
    );

    queue(async () =>
      set_procedures((await (await fetch("/api/get_procedures")).json()) as any)
    );

    queue(async () =>
      set_running((await (await fetch("/api/get_running")).json()) as any)
    );

    queue(async () =>
      set_admin((await (await fetch("/api/get_admin")).json()) as any)
    );
  }, []);

  utils.react.use_effect(() => {
    refresh_schema();
  }, []);

  utils.react.use_effect(() => {
    (window as any).AC_QUEUE = queue;
  }, [queue]);

  return (
    <>
      <Context.Provider
        value={{
          schema: {
            admin,
            extensions,
            procedures,
            running,
          },
          output: output,
          gen_output: (...args) => set_output([...output, gen_output(...args)]),
          clear_output: () => set_output([]),
          queue: queue,
          refresh_schema: refresh_schema,
        }}
      >
        {props.children}
      </Context.Provider>

      {is_loading ? (
        <>
          <div className="absolute bg-[#00000077] w-full h-full top-0 left-0 z-50" />
          <div className="absolute w-full h-full top-0 left-0 z-50 flex items-center">
            <div className="grow" />
            <div className="w-[20%] h-fit">
              <components.icon.spinner.Spinner color="PRIMARY" stroke={3} />
            </div>
            <div className="grow" />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const Loading = () => {
  const api = utils.react.use_context(components.ac.api.Context);

  utils.react.use_effect(() => {
    let fin: types.general.Handler | undefined = undefined;
    let check = false;

    api.queue(
      () =>
        new Promise((resolve) => {
          if (check) {
            resolve();
            return;
          }

          fin = resolve;
        }),
      () => {}
    );

    return () => {
      if (fin === undefined) {
        check = true;
        return;
      }

      fin();
    };
  }, []);

  return <></>;
};

export {
  Provider,
  Context,
  Loading,
  gen_accordion_extension,
  gen_accordion_procedure,
  gen_accordion_running,
};
