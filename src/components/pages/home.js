import { connect } from 'redux-bundler-preact'
import { h } from 'preact'

const HomePage = ({baseDataStatus, baseData}) => (
  <article>
    <p>Open dev tools to see output of debug bundle</p>
    <p>So the intresting thing here is the entire application is basically running in a web worker</p>
    <p>Open the network tab and you'll notice there's a lot more code in /build/worker.js than in main.js</p>
    <p>URL state is still stored in, and controlled by redux. But bound to the browser. So clicking a link, triggers a doUpdateUrl action creator, which sends that action to the worker, which processes it, and the new url state is echoed back to the main thread, where it it applied to the browser.</p>

    <div class='ph3 ba br3 bg-lightest-blue'>
      <h3>Dynamically Fetched Data:</h3>
      <p>Source: https://swapi.co/api/</p>
      <p>Status: {baseDataStatus}</p>
      <p>result:
        <pre><code>{JSON.stringify(baseData, null, 2)}</code></pre>
      </p>
    </div>
  </article>
)

export default connect(
  'selectBaseDataStatus',
  'selectBaseData',
  HomePage
)
