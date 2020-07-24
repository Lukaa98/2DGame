using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundEffects : MonoBehaviour
{
   public AudioSource levelMusic;
   public AudioSource deathSong; 
   
   public bool levelSong = true;
      public bool levelSong = false;



    public void levelMusic()
    {
        if(levelMusic.isPlaying)
        levelSong = false;
        {
            if(!deathSong.isPlaying && DeathSong == false)
            {
                deathSong.Play();
                DeathSong = true;
            }
        }
    }

}
