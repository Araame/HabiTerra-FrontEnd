const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const babel = require("@babel/core");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const React = require("react");

const root = path.resolve(__dirname, "..");
const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? walk(file)
      : /\.[jt]sx?$/.test(file)
        ? [file]
        : [];
  });
const files = [
  path.join(root, "App.js"),
  ...["app", "components", "shared"].flatMap((name) =>
    walk(path.join(root, name)),
  ),
];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  assert(!/\p{Extended_Pictographic}/u.test(source), `Emoji in ${file}`);
  const ast = parser.parse(source, {
    sourceType: "unambiguous",
    plugins: ["jsx"],
  });
  traverse(ast, {
    ImportDeclaration({ node }) {
      if (node.source.value.startsWith(".")) {
        const target = path.resolve(path.dirname(file), node.source.value);
        assert(
          ["", ".js", ".jsx", "/index.js", "/index.jsx"].some((suffix) =>
            fs.existsSync(target + suffix),
          ),
          `Missing import ${target}`,
        );
      }
    },
  });
}

// Evaluate the real JSX with lightweight native primitives; no device renderer is implied.
function load(relative, mocks = {}, development = true) {
  const filename = path.join(root, relative);
  const { code } = babel.transformFileSync(filename, {
    babelrc: false,
    configFile: false,
    plugins: [
      ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
      "@babel/plugin-transform-modules-commonjs",
    ],
  });
  const module = { exports: {} };
  vm.runInNewContext(
    code,
    {
      module,
      exports: module.exports,
      __DEV__: development,
      require: (name) =>
        Object.hasOwn(mocks, name)
          ? mocks[name]
          : require(
              name.startsWith(".")
                ? path.resolve(path.dirname(filename), name)
                : name,
            ),
    },
    { filename },
  );
  return module.exports;
}
function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement(node)) return [];
  return [node, ...elements(node.props.children)];
}
const { navigationConfig } = load("app/navigation/navigationConfig.js");
const native = { View: "View", Text: "Text", Pressable: "Pressable" };
for (const entries of Object.values(navigationConfig)) {
  for (const bottom of [0, 34]) {
    const BottomBar = load("components/navigation/BottomBar.jsx", {
      "react-native": native,
      "@expo/vector-icons/Ionicons": "Icon",
      "react-native-safe-area-context": {
        useSafeAreaInsets: () => ({ bottom, left: 0, right: 0 }),
      },
    }).default;
    const routes = entries.map(({ name }) => ({ name, key: name + "-key" }));
    const descriptors = Object.fromEntries(
      entries.map((entry, index) => [
        routes[index].key,
        { options: { title: entry.label, tabBarIconName: entry.icon } },
      ]),
    );
    const emitted = [],
      navigated = [];
    let prevent = false;
    const tree = BottomBar({
      state: { routes, index: 0 },
      descriptors,
      navigation: {
        emit: (event) => {
          emitted.push(event);
          return { defaultPrevented: prevent };
        },
        navigate: (...args) => navigated.push(args),
      },
    });
    assert.equal(tree.props.style.paddingBottom, bottom + 16);
    const tabs = elements(tree).filter(
      (element) => element.type === "Pressable",
    );
    assert.equal(tabs.length, 4);
    assert.equal(
      tabs.filter((tab) => tab.props.accessibilityState.selected).length,
      1,
    );
    tabs[0].props.onPress();
    assert.equal(navigated.length, 0);
    tabs[1].props.onPress();
    assert.equal(navigated[0][0], entries[1].name);
    assert.equal(emitted[1].type, "tabPress");
    assert.equal(emitted[1].canPreventDefault, true);
    prevent = true;
    tabs[2].props.onPress();
    assert.equal(navigated.length, 1);
    tabs[3].props.onLongPress();
    assert.equal(emitted.at(-1).type, "tabLongPress");
    assert(
      elements(tree)
        .filter((element) => element.type === "Icon")
        .every(
          (icon) =>
            icon.props.size === 23 && icon.props.name.endsWith("-outline"),
        ),
    );
  }
}

const stack = { Navigator: "Navigator", Screen: "Screen", Group: "Group" };
const appMocks = {
  "@react-navigation/native-stack": { createNativeStackNavigator: () => stack },
  "react-native": native,
  "./AuthNavigator": "AuthNavigator",
  "./TenantNavigator": "TenantNavigator",
  "./AgencyNavigator": "AgencyNavigator",
  "../../components/common/FeedbackStates": {
    EmptyState: "EmptyState",
    ErrorState: "ErrorState",
  },
  "./navigationConfig": load("app/navigation/navigationConfig.js"),
};
for (const development of [false, true]) {
  const AppNavigator = load(
    "app/navigation/AppNavigator.jsx",
    appMocks,
    development,
  ).default;
  const guest = elements(AppNavigator({}));
  assert(guest.some((node) => node.props.name === "Auth"));
  assert.equal(
    guest.some((node) => node.props.name === "Preview"),
    development,
  );
  for (const [role, expected] of [
    ["LOCATAIRE", "TenantNavigator"],
    ["AGENCE", "AgencyNavigator"],
    ["PROPRIETAIRE", "View"],
    ["UNKNOWN", "ErrorState"],
  ]) {
    const authenticated = elements(
      AppNavigator({ session: { user: { id: "test", role } } }),
    );
    assert(
      !authenticated.some(
        (node) => node.props.name === "Auth" || node.props.name === "Preview",
      ),
    );
    const screen = authenticated.find(
      (node) => node.props.name === "Authenticated",
    );
    const roleElement = screen.props.children();
    assert.equal(roleElement.type(roleElement.props).type, expected);
  }
}

// Use React Navigation's actual routers to verify tab history and stack Back.
async function checkRouters() {
  const { TabRouter, StackRouter, CommonActions, StackActions } = await import(
    "@react-navigation/routers"
  );
  const routeNames = navigationConfig.AGENCE.map((tab) => tab.name);
  const options = { routeNames, routeParamList: {}, routeGetIdList: {} };
  const router = TabRouter({ backBehavior: "history" });
  let state = router.getInitialState(options);
  state = router.getStateForAction(
    state,
    CommonActions.navigate(routeNames[1]),
    options,
  );
  state = router.getStateForAction(
    state,
    CommonActions.navigate(routeNames[2]),
    options,
  );
  state = router.getStateForAction(state, CommonActions.goBack(), options);
  assert.equal(state.routes[state.index].name, routeNames[1]);
  const stackOptions = {
    routeNames: ["Payments", "TenantDossier", "AuditDossier"],
    routeParamList: {},
    routeGetIdList: {},
  };
  const stackRouter = StackRouter({ initialRouteName: "Payments" });
  let stackState = stackRouter.getInitialState(stackOptions);
  stackState = stackRouter.getStateForAction(
    stackState,
    StackActions.push("TenantDossier", { dossierId: "jean" }),
    stackOptions,
  );
  stackState = stackRouter.getStateForAction(
    stackState,
    StackActions.push("AuditDossier"),
    stackOptions,
  );
  stackState = stackRouter.getStateForAction(
    stackState,
    CommonActions.goBack(),
    stackOptions,
  );
  assert.equal(stackState.routes[stackState.index].name, "TenantDossier");
  stackState = stackRouter.getStateForAction(
    stackState,
    CommonActions.goBack(),
    stackOptions,
  );
  assert.equal(stackState.routes[stackState.index].name, "Payments");
}
checkRouters()
  .then(() =>
    console.log(
      `PASS: ${files.length} files, imports, icons, BottomBar events/insets, role routing, preview isolation, tab history and stack Back.`,
    ),
  )
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
