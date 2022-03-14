import './Attacks.css';
import React from 'react';
import AttackCard from './AttackCard'

function Attacks() {
  return(
    <div className="attacks">
      <div className="attacks__container">
         < AttackCard 
         name="Slash"
         type="Normal"
         description="Flailing opponents will be destroyed by the power of slash."
         id="1"
         damageType="Attack"
         damage="40"
         manaCost="40"
         image="https://c4.wallpaperflare.com/wallpaper/423/958/326/fantasy-art-katana-samurai-wallpaper-preview.jpg"
         />
          < AttackCard 
         name="Slash"
         type="Normal"
         description="Flailing opponents will be destroyed by the power of slash."
         id="1"
         damageType="Attack"
         damage="40"
         manaCost="40"
         image="https://c4.wallpaperflare.com/wallpaper/423/958/326/fantasy-art-katana-samurai-wallpaper-preview.jpg"
         />
          < AttackCard 
         name="Slash"
         type="Normal"
         description="Flailing opponents will be destroyed by the power of slash."
         id="1"
         damageType="Attack"
         damage="40"
         manaCost="40"
         image="https://c4.wallpaperflare.com/wallpaper/423/958/326/fantasy-art-katana-samurai-wallpaper-preview.jpg"
         />
      </div>
    </div>
    )
}

export default Attacks;