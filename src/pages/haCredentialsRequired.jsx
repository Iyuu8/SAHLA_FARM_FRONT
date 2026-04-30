import { Link } from 'react-router'

export default function HACredentialsRequired({ configurationError }) {


  let title = null
  let header = null
  let description = null

  switch (configurationError?.status) {
    case "backendDown":
      title = "Server Unreachable"
      header = "We can't reach the backend server."
      description = "Please ensure the backend server is running and accessible."
      break;
    case "noCredentials":
      title = "Welcome to Sahla Farm!"
      header = "Please set up your Home Assistant credentials."
      description = "To access the full features of this app, you need to connect your Home Assistant instance. Please provide your HA URL and a Long-Lived Access Token in the Settings page."
      break;
    case "expired":
      title = "Token Expired"
      header = "Setup your Home Assistant credentials to continue."
      description = "Please generate a new Long-Lived Access Token in Home Assistant and update it in Settings."
      break;
    case "notFound":
      title = "Server issues"
      header = "We couldn't find your Home Assistant instance."
      description = "Please setup again your Home Assistant credentials in the Settings page. If the problem persists, ensure your HA instance is running and accessible from this app."
      break;
    case "haDown":
      title = "Home Assistant Unreachable"
      header = "Your Home Assistant server is down."
      description = "We can't connect to your Home Assistant instance. You can still access the History, notifications and Chat features, but real-time data won't work until HA is back online."
      break;
    case "missingHelper":
      title = "HA Instance ID Helper Missing"
      header = "Your Home Assistant instance is missing a required helper."
      description = "Please create an input_text helper with entity_id 'input_text.ha_instance_id' in Home Assistant."  
      break;
    case "invalid":
    default:
      title = "Invalid Credentials"
      header = "Your Home Assistant credentials are invalid."
      description = "Please verify your Home Assistant URL and Long-Lived Access Token in Settings."
      break;
  } 
  

  return (
    <div className='w-full h-full flex-1 bg-[#F5F7F6] font-newblack flex items-center justify-center px-4 sm:px-6 py-6'>
      <div className='w-full max-w-2xl rounded-2xl border border-[#D9D9D9] bg-white shadow-sm p-8 md:p-12 text-center'>
        <p className='text-[#55BB33] font-bold text-sm tracking-wide'>{title}</p>
        <h1 className='mt-2 text-[#1A3D00] text-2xl md:text-4xl font-bold'>
          {header} 
        </h1>
        <p className='mt-4 text-[#636364] text-base md:text-lg'>
          {description}
        </p>
        <div className='mt-8'> 
          {configurationError?.status !== "haDown" && (
          <Link
            to='/settings'
            className='inline-flex bg-[#55BB33] hover:bg-[#66cd43] text-white font-bold rounded-lg px-6 py-3 transition-all duration-300'
          >
            Go To Settings
          </Link>
          )}
        </div>
      </div>
    </div>
  )
}



