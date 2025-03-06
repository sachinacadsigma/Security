import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

const reactPlugin = new ReactPlugin();
const history = new createBrowserHistory();

const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      'InstrumentationKey=1170a4f2-838b-4651-bbbb-794b9505a6ae;IngestionEndpoint=https://eastus2-3.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus2.livediagnostics.monitor.azure.com/;ApplicationId=c83171d0-528a-465c-844f-d7739614bc6c',
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history },
    },
  },
});

appInsights.loadAppInsights();

export { appInsights, reactPlugin };
