import React, {Component} from "react"
import Navbar from '../components/Navbar';
import Cover from '../components/Cover'
import Panel from '../components/Panel'
import Story from '../components/Story'
import SocialBar from '../components/SocialBar'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      loading: false
    }
  }

	render() {
		return(
			<div className="app_page">
        <Navbar />
				<Cover />
        <Panel />
        <Story />
        <SocialBar />
			</div>
			)
}	
}

export default Home;